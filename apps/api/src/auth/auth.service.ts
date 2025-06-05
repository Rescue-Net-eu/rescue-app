import { Injectable, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { InvitationsService } from '../invitations/invitations.service';
import { SignupVolunteerDto } from './dto/signup-volunteer.dto';
import { SignupDirectDto } from './dto/signup-direct.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { sendEmail } from '../common/utils/send-email';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private invitations: InvitationsService,
    private jwtService: JwtService,
  ) {}

  private generateUsername() {
    return uuidv4().replace(/-/g, '').slice(0, 12);
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  async signupVolunteer(dto: SignupVolunteerDto) {
    const inv = await this.prisma.invitationToken.findUnique({ where: { token: dto.token } });
    if (!inv || inv.used) {
      throw new BadRequestException('Invalid or expired token');
    }
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException('User with this email already exists');
    }
    const username = this.generateUsername();
    const tempPassword = uuidv4().replace(/-/g, '').slice(0, 12);
    const passwordHash = await this.hashPassword(tempPassword);

    const user = await this.prisma.user.create({
      data: {
        userType: 'VOLUNTEER',
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        age: dto.age,
        city: dto.city,
        country: (await this.prisma.organization.findUnique({ where: { id: inv.targetOrgId } })).country,
        username,
        passwordHash,
        isActive: true,
      },
    });

    await this.prisma.membership.create({
      data: {
        userId: user.id,
        orgId: inv.targetOrgId!,
        role: 'VOLUNTEER',
        activeByOrg: true,
        activeByUser: true,
        status: 'ACTIVE',
      },
    });

    await this.invitations.markUsed(dto.token);

    await sendEmail(
      dto.email,
      'Your Rescue-Net.eu Credentials',
      `<p>Your account has been created. Username: <b>${username}</b><br/>Temporary Password: <b>${tempPassword}</b></p>`
    );
    return { username, tempPassword };
  }

  async signupDirect(dto: SignupDirectDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException('User with this email already exists');
    }
    const username = this.generateUsername();
    const tempPassword = uuidv4().replace(/-/g, '').slice(0, 12);
    const passwordHash = await this.hashPassword(tempPassword);

    const user = await this.prisma.user.create({
      data: {
        userType: 'VOLUNTEER',
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        age: dto.age,
        city: dto.city,
        country: dto.country,
        username,
        passwordHash,
        isActive: false,
      },
    });

    await this.prisma.membership.create({
      data: {
        userId: user.id,
        role: 'VOLUNTEER',
        activeByOrg: false,
        activeByUser: true,
        status: 'PENDING',
      },
    });

    await sendEmail(
      dto.email,
      'Your Rescue-Net.eu Credentials (Pending)',
      `<p>Your account has been created and is pending activation. Username: <b>${username}</b><br/>Temporary Password: <b>${tempPassword}</b></p>`
    );
    return { username, tempPassword };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } , include:{memberships:true}});
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const match = await bcrypt.compare(pass, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('Account is not active');
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    const payload = { sub: user.id, role: user.memberships.length > 0 ? user.memberships[0].role : 'VOLUNTEER' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
