package com.hoard.hoard;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Created by AndreSilva on 17/11/14
 */

public class Session {

    private static final String PREFERENCES = "HoardPreferences";

    private static final String USER = "HoardUserEmail";

    private static final String COOKIE = "HoardUserCookie";

    private SharedPreferences sharedpreferences;

    public Session(Context context) {
        sharedpreferences = context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE);
    }

    public boolean checkSessionForUser() {
        return sharedpreferences.contains(USER);
    }

    public boolean checkSessionForCookie() {return sharedpreferences.contains(COOKIE);}

    public String getUserEmail() {return sharedpreferences.getString(USER,null);}

    public String getCookie() {return sharedpreferences.getString(COOKIE,null);}

    public void logIn(String userEmail, String userCookie) {
        SharedPreferences.Editor editor = sharedpreferences.edit();

        editor.putString(USER, userEmail);
        editor.putString(COOKIE, userCookie);
        editor.apply();
    }

    public void logOut() {
        SharedPreferences.Editor editor = sharedpreferences.edit();

        editor.clear();
        editor.apply();
    }
}
