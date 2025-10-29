package tn.esprit.Controller;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import org.apache.commons.codec.binary.Base32;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tn.esprit.Entities.User;
import tn.esprit.Services.UserDetailsServiceImpl;
import tn.esprit.payload.OTPRequest;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/api/2fa")
public class TwoFactorController {

    @Autowired
    private UserDetailsServiceImpl userService; // Service to handle user-related operations


    private static final SecureRandom secureRandom = new SecureRandom();
    private static final Base32 base32 = new Base32();

    // Generate a secret key for the user
    public static String generateSecretKey() {
        byte[] randomBytes = new byte[20];  // Generate a 160-bit (20-byte) random secret key
        secureRandom.nextBytes(randomBytes);
        return base32.encodeAsString(randomBytes);
    }

    // Generate the QR code URL
    private String getQRCodeUrl(String user, String secretKey) {
        return "otpauth://totp/YourApp:" + user + "?secret=" + secretKey + "&issuer=YourApp";
    }

    // Generate the QR Code image for the user to scan
    @PostMapping("/generate-qr")
    public ResponseEntity<?> generateQRCode(@RequestBody User user) {
        try {
            String username = user.getUsername();
            String secretKey = generateSecretKey();
            userService.save2FASecret(username, secretKey);

            String qrCodeUrl = getQRCodeUrl(username, secretKey);
            BufferedImage qrCodeImage = QRCodeUtil.generateQRCodeImage(qrCodeUrl);
            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            ImageIO.write(qrCodeImage, "PNG", pngOutputStream);
            byte[] qrCodeBytes = pngOutputStream.toByteArray();
            String qrCodeBase64 = Base64.getEncoder().encodeToString(qrCodeBytes);

            // Create a proper JSON response
            Map<String, String> response = new HashMap<>();
            response.put("qrCodeBase64", qrCodeBase64);
            response.put("secretKey", secretKey);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error generating QR code");
        }
    }


    @PostMapping("/verify/{otpCode}")
    public ResponseEntity<?> verifyOTP(@PathVariable String otpCode, @RequestBody OTPRequest otpRequest) {
        try {
            System.out.println("Received OTP: " + otpCode);
            System.out.println("Username: " + otpRequest.getUsername());
            System.out.println("Received Secret Key: " + otpRequest.getTwoFactorSecret());

            String secretKey = otpRequest.getTwoFactorSecret();
            if (secretKey == null || secretKey.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.singletonMap("error", "2FA secret not found."));
            }

            int otpIntCode = Integer.parseInt(otpCode);
            GoogleAuthenticator googleAuthenticator = new GoogleAuthenticator();
            boolean isCodeValid = googleAuthenticator.authorize(secretKey, otpIntCode);

            if (isCodeValid) {
                return ResponseEntity.ok(Collections.singletonMap("message", "2FA verification successful"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.singletonMap("error", "Invalid OTP code"));
            }
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Invalid OTP format"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Error during verification"));
        }
    }



}
