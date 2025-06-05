import React from 'react';
import { useParams } from 'react-router-dom';
import VolunteerProfile from '../components/volunteers/VolunteerProfile';

export default function VolunteerProfilePage() {
  const { volunteerId } = useParams();
  return <VolunteerProfile volunteerId={volunteerId} />;
}
