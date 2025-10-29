package tn.esprit.jwt;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;

import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.SignatureAlgorithm;


import io.jsonwebtoken.*;
import tn.esprit.Services.UserDetailsImpl;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import static org.apache.commons.io.file.attribute.FileTimes.toDate;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${bezkoder.app.jwtSecret}")
    private String jwtSecret;

    @Value("${bezkoder.app.jwtExpirationMs}")
    private int jwtExpirationMs;


    public String generateJwtToken(Authentication authentication) {

        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        // Ensure jwtSecret is at least 512 bits long (64 characters)
        SecretKey key = new SecretKeySpec(jwtSecret.getBytes(), SignatureAlgorithm.HS512.getJcaName());

        // Set the expiration date for 15 minutes from now
        Date expirationDate = new Date(System.currentTimeMillis() + jwtExpirationMs);  // Use jwtExpirationMs for dynamic expiration time


        // Build JWT token
        String jwtToken = Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuer("your-app")  // You can replace this with your own application name or URI
                .setIssuedAt(new Date())
                .setExpiration(expirationDate)
                .signWith(key)  // Use the custom key
                .compact();

        System.out.println("The returned token is: " + jwtToken);

        return jwtToken;
    }
    public String getUserNameFromJwtToken(String token) {
        // Ensure you use the correct signing key
        SecretKey key = new SecretKeySpec(jwtSecret.getBytes(), SignatureAlgorithm.HS512.getJcaName());

        // Use JwtParserBuilder for the latest approach
        return Jwts.parserBuilder()
                .setSigningKey(key)  // Provide the secret key used to sign the JWT
                .build()
                .parseClaimsJws(token)  // Parse the JWT
                .getBody()
                .getSubject();  // Extract the username from the token's subject
    }



    public boolean validateJwtToken(String authToken) {
        try {
            // Ensure you use the correct signing key
            SecretKey key = new SecretKeySpec(jwtSecret.getBytes(), SignatureAlgorithm.HS512.getJcaName());

            // Use JwtParserBuilder for the latest approach
            Jwts.parserBuilder()
                    .setSigningKey(key)  // Provide the secret key used to sign the JWT
                    .build()
                    .parseClaimsJws(authToken);  // Parse the JWT

            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }

}