import { useRef, useState } from "react";
import {
  Bell,
  Camera,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

function Settings() {
  const fileInputRef = useRef(null);

  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    username: savedUser.username || "",
    email: savedUser.email || "",
    bio: localStorage.getItem("profileBio") || "",
  });

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem(
      "notificationSettings"
    );

    if (savedNotifications) {
      return JSON.parse(savedNotifications);
    }

    return {
      matchAlerts: true,
      ticketUpdates: true,
      promotionalEmails: false,
    };
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleNotificationChange = (name) => {
    setNotifications((previousSettings) => ({
      ...previousSettings,
      [name]: !previousSettings[name],
    }));
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please choose a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("The image must be smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      setProfileImage(imageData);
      localStorage.setItem("profileImage", imageData);
    };

    reader.onerror = () => {
      alert("The image could not be loaded. Please try another image.");
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveProfileImage = () => {
    setProfileImage("");
    localStorage.removeItem("profileImage");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedUser = {
      ...savedUser,
      username: formData.username.trim(),
      email: formData.email.trim(),
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("profileBio", formData.bio);
    localStorage.setItem(
      "notificationSettings",
      JSON.stringify(notifications)
    );

    window.dispatchEvent(new Event("userUpdated"));

    alert("Settings saved successfully.");
  };

  return (
    <main className="settings-page">
      <section className="settings-heading">
        <p className="settings-eyebrow">ACCOUNT CONTROL</p>

        <h1>Settings</h1>

        <p>
          Manage your ScoreTicket profile, security, and notification
          preferences.
        </p>
      </section>

      <form className="settings-content" onSubmit={handleSubmit}>
        <section className="settings-section">
          <div className="settings-section-title">
            <UserRound size={20} />

            <div>
              <h2>Profile information</h2>
              <p>Update the information shown on your account.</p>
            </div>
          </div>

          <div className="settings-card settings-profile-card">
            <div className="settings-avatar-section">
              <div className="settings-avatar-wrapper">
                <button
                  type="button"
                  className="settings-avatar settings-avatar-button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change profile picture"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="settings-avatar-image"
                    />
                  ) : (
                    (formData.username || "U")
                      .charAt(0)
                      .toUpperCase()
                  )}
                </button>

                <button
                  className="settings-camera-button"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Choose profile picture"
                >
                  <Camera size={17} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleProfileImageChange}
                  hidden
                />
              </div>

              <div className="settings-avatar-actions">
                <button
                  type="button"
                  className="settings-image-change-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change picture
                </button>

                {profileImage && (
                  <button
                    type="button"
                    className="settings-image-remove-button"
                    onClick={handleRemoveProfileImage}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="settings-form-grid">
              <label className="settings-field">
                <span>Username</span>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  required
                />
              </label>

              <label className="settings-field">
                <span>Email address</span>

                <div className="settings-input-icon">
                  <Mail size={18} />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </label>

              <label className="settings-field settings-field-full">
                <span>Bio</span>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell us something about yourself"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-title">
            <Bell size={20} />

            <div>
              <h2>Notification preferences</h2>
              <p>Choose which ScoreTicket updates you want to receive.</p>
            </div>
          </div>

          <div className="settings-card settings-list">
            <div className="settings-list-item">
              <div>
                <h3>Match alerts</h3>
                <p>
                  Receive reminders and updates for upcoming matches.
                </p>
              </div>

              <button
                type="button"
                className={`settings-switch ${
                  notifications.matchAlerts ? "is-active" : ""
                }`}
                onClick={() =>
                  handleNotificationChange("matchAlerts")
                }
                aria-pressed={notifications.matchAlerts}
                aria-label="Toggle match alerts"
              >
                <span />
              </button>
            </div>

            <div className="settings-list-item">
              <div>
                <h3>Ticket updates</h3>
                <p>
                  Receive booking confirmations and ticket status
                  changes.
                </p>
              </div>

              <button
                type="button"
                className={`settings-switch ${
                  notifications.ticketUpdates ? "is-active" : ""
                }`}
                onClick={() =>
                  handleNotificationChange("ticketUpdates")
                }
                aria-pressed={notifications.ticketUpdates}
                aria-label="Toggle ticket updates"
              >
                <span />
              </button>
            </div>

            <div className="settings-list-item">
              <div>
                <h3>Promotional emails</h3>
                <p>
                  Receive special offers and new event announcements.
                </p>
              </div>

              <button
                type="button"
                className={`settings-switch ${
                  notifications.promotionalEmails
                    ? "is-active"
                    : ""
                }`}
                onClick={() =>
                  handleNotificationChange("promotionalEmails")
                }
                aria-pressed={notifications.promotionalEmails}
                aria-label="Toggle promotional emails"
              >
                <span />
              </button>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-title">
            <ShieldCheck size={20} />

            <div>
              <h2>Security</h2>
              <p>Manage your password and account protection.</p>
            </div>
          </div>

          <div className="settings-card settings-security-card">
            <div className="settings-security-icon">
              <LockKeyhole size={22} />
            </div>

            <div>
              <h3>Password</h3>
              <p>
                Password changes will be connected to the backend in a
                later step.
              </p>
            </div>

            <button
              className="settings-secondary-button"
              type="button"
              onClick={() =>
                alert(
                  "The change-password backend is not connected yet."
                )
              }
            >
              Change password
            </button>
          </div>
        </section>

        <div className="settings-actions">
          <button className="settings-save-button" type="submit">
            <Save size={18} />
            Save changes
          </button>
        </div>
      </form>
    </main>
  );
}

export default Settings;