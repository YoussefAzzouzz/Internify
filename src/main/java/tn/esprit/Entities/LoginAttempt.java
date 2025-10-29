package tn.esprit.Entities;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter

public class LoginAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 📅 Date et heure de la tentative
    private LocalDateTime attemptTime;

public String loginText;

public String getLoginText() { return loginText; }
public void setLoginText(String loginText) { this.loginText = loginText; }

    // 🌍 Informations du client
    private String clientIp;
    private Double lat;
    private Double lon;
    private String timezone;
    private String country;
    private String countryCode;
    private String region;
    private String regionName;
    private String city;

    @Column(columnDefinition = "JSON")
    private String embedding; // Store embedding as JSON string

         @JsonIgnore  // ← Add this to prevent circular reference

    // 👤 Relation avec l'utilisateur (plusieurs tentatives pour un seul user)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // 🧱 Constructeurs
    public LoginAttempt() {
        this.attemptTime = LocalDateTime.now();
    }

    public LoginAttempt(User user, String clientIp, Double lat, Double lon, String timezone,
                        String country, String countryCode, String region, String regionName, String city) {
        this.user = user;
        this.clientIp = clientIp;
        this.lat = lat;
        this.lon = lon;
        this.timezone = timezone;
        this.country = country;
        this.countryCode = countryCode;
        this.region = region;
        this.regionName = regionName;
        this.city = city;
        this.attemptTime = LocalDateTime.now();
    }

    // 🧾 Getters et Setters
    public Long getId() { return id; }
    public LocalDateTime getAttemptTime() { return attemptTime; }
    public void setAttemptTime(LocalDateTime attemptTime) { this.attemptTime = attemptTime; }

    public String getClientIp() { return clientIp; }
    public void setClientIp(String clientIp) { this.clientIp = clientIp; }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLon() { return lon; }
    public void setLon(Double lon) { this.lon = lon; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getRegionName() { return regionName; }
    public void setRegionName(String regionName) { this.regionName = regionName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }


    @Override
public String toString() {
    return "LoginAttempt{" +
            "userId=" + (user != null ? user.getId() : null) +
            ", clientIp='" + clientIp + '\'' +
            ", lat=" + lat +
            ", lon=" + lon +
            ", timezone='" + timezone + '\'' +
            ", country='" + country + '\'' +
            ", countryCode='" + countryCode + '\'' +
            ", region='" + region + '\'' +
            ", regionName='" + regionName + '\'' +
            ", city='" + city + '\'' +
            ", attemptTime=" + attemptTime +
            '}';
}

}
