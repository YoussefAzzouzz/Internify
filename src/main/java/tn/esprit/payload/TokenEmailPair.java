package tn.esprit.payload;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenEmailPair {
    private String token;
    private String email;
    public TokenEmailPair() {

    }
    public TokenEmailPair(String token, String email) {
        this.token = token;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    // Optionally, you can add setter methods if you want to modify them later.
}
