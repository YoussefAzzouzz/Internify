package tn.esprit.payload.request;

public class UserLocation {
    private String username;
    private double latitude;
    private double longitude;
    private String city;
    private String country;

    public UserLocation() {}

    public UserLocation(String username, double latitude, double longitude, String city, String country) {
        this.username = username;
        this.latitude = latitude;
        this.longitude = longitude;
        this.city = city;
        this.country = country;
    }

    public String getUsername() {
        return username;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public String getCity() {
        return city;
    }

    public String getCountry() {
        return country;
    }
}
