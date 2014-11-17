package com.hoard.hoard;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Created by AndreSilva on 17/11/14
 */

public class Session {

    private static final String PREFERENCES = "HoardPreferences";

    private static final String USER = "HoardUserEmail";

    private SharedPreferences sharedpreferences;

    public Session(Context context) {
        sharedpreferences = context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE);
    }

    public boolean checkSessionForUser() {
        return sharedpreferences.contains(USER);
    }

    public void logIn(String userEmail) {
        SharedPreferences.Editor editor = sharedpreferences.edit();

        editor.putString(USER, userEmail);
        editor.apply();
    }

    public void logOut() {
        SharedPreferences.Editor editor = sharedpreferences.edit();

        editor.clear();
        editor.apply();
    }
}
