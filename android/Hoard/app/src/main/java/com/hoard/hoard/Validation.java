package com.hoard.hoard;

/**
 * Created by AndreSilva on 12/11/14
 */

public class Validation {

    public boolean isValidEmail(String email) {
        return android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches();
    }

    public boolean isValidPassword(String password) {
        return password != null && password.length() > 0;
    }

    public boolean isValidPasswordConfirmation(String password, String confirmation) {
        return isValidPassword(password) & isValidPassword(confirmation) & password.matches(confirmation);
    }
}
