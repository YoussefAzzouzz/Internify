package tn.esprit.services;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    private final String ACCOUNT_SID = "ACb80b6edea95167a5c85ba3ca351c7173";
    private final String AUTH_TOKEN = "c2365f1a4e1995aa751d6c44031177ae";
    private final String TWILIO_NUMBER = "+15855132861";

    public SmsService() {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
    }

    public void sendSms(String to, String body) {
        Message.creator(
                new com.twilio.type.PhoneNumber(to),
                new com.twilio.type.PhoneNumber(TWILIO_NUMBER),
                body
        ).create();
    }
}

