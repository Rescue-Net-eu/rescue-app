"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

type Alert = {
  id: string;
  title: string;
  description?: string;
  country: string;
  region?: string;
  localities: string[];
  status: string;
  latitude?: number;
  longitude?: number;
};

export default function AdminAlertsPage() {
  const { t } = useTranslation("common");

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [localities, setLocalities] = useState("");
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const token = document.cookie.replace("token=", "");
  const orgId = localStorage.getItem("orgId") || "";

  const fetchAlerts = async () => {
    setLoading(true);
    const res = await fetch("/api/alerts?scope=all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAlerts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const grabMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert("Unable to fetch your location. Please enter manually.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const createAlert = async () => {
    const body: any = {
      title,
      description,
      sourceOrgId: orgId,
      country,
      region,
      localities: localities.split(",").map((l) => l.trim()),
      ...(latitude !== "" ? { latitude } : {}),
      ...(longitude !== "" ? { longitude } : {}),
    };
    await fetch("/api/alerts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    fetchAlerts();
  };

  const approveAlert = async (id: string) => {
    await fetch(`/api/alerts/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "ACTIVE" }),
    });
    fetchAlerts();
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl mb-4">{t("admin.create_alert")}</h1>
      <div className="space-y-2 mb-6">
        <input
          placeholder={t("alerts.title_label")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder={t("alerts.description_label")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder={t("alerts.country_label")}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder={t("alerts.region_label")}
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder={t("alerts.locality_label")}
          value={localities}
          onChange={(e) => setLocalities(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <div className="flex space-x-2">
          <input
            type="number"
            step="any"
            placeholder={t("alerts.latitude_label")}
            value={latitude}
            onChange={(e) => setLatitude(parseFloat(e.target.value) || "")}
            className="w-1/2 border p-2 rounded"
          />
          <input
            type="number"
            step="any"
            placeholder={t("alerts.longitude_label")}
            value={longitude}
            onChange={(e) => setLongitude(parseFloat(e.target.value) || "")}
            className="w-1/2 border p-2 rounded"
          />
        </div>
        <button
          onClick={grabMyLocation}
          className="w-full bg-gray-300 text-black p-2 rounded"
        >
          {t("alerts.use_my_location")}
        </button>
        <button
          onClick={createAlert}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {t("alerts.submit_button")}
        </button>
      </div>

      <section>
        <h2 className="text-xl mb-2">{t("admin.filter_label")}</h2>
        <button
          onClick={() => fetchAlerts()}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          {t("common.loading")}
        </button>
      </section>

      <section className="mt-6">
        <h2 className="text-xl mb-2">Existing Alerts</h2>
        {loading ? (
          <p>{t("common.loading")}</p>
        ) : (
          <ul className="space-y-2">
            {alerts.map((alert) => (
              <li key={alert.id} className="border p-2 rounded">
                <div className="flex justify-between items-center">
                  <span>
                    {alert.title} ({t(`alerts.${alert.status.toLowerCase()}_message`)})
                  </span>
                  {alert.status === "PENDING_APPROVAL" && (
                    <button
                      onClick={() => approveAlert(alert.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      {t("admin.approve_alert")}
                    </button>
                  )}
                </div>
                <p>{alert.description}</p>
                <p>
                  {t("alerts.country_label")}: {alert.country}
                </p>
                {alert.region && (
                  <p>
                    {t("alerts.region_label")}: {alert.region}
                  </p>
                )}
                <p>
                  {t("alerts.locality_label")}: {alert.localities.join(", ")}
                </p>
                {alert.latitude != null && alert.longitude != null && (
                  <p>
                    {t("alerts.coordinates_label")}: {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
