package com.hoard.hoard;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by AndreSilva on 12/11/14
 */

public class Validation {

    private final Pattern EMAIL_ADDRESS_PATTERN = Pattern.compile("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"+"[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$");

    public boolean isValidEmail(String email) {
        Matcher matcher = EMAIL_ADDRESS_PATTERN.matcher(email);
        return matcher.matches();
    }

    public boolean isValidPassword(String password) {
        return password != null && password.length() > 0;
    }

    public boolean isValidPasswordConfirmation(String password, String confirmation) {
        return isValidPassword(password) & isValidPassword(confirmation) & password.matches(confirmation);
    }
}
