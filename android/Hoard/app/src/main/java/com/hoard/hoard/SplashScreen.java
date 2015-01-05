package com.hoard.hoard;

/**
 * Created by AndreSilva on 29/10/14
 */

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

public class SplashScreen extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        Session session = new Session(SplashScreen.this);

        if(session.checkSessionForUser()) {
            Intent i = new Intent(SplashScreen.this, MainActivity.class);
            Bundle bundle = new Bundle();
            bundle.putString("notification", getResources().getString(R.string.notification_already));
            i.putExtras(bundle);
            startActivity(i);
        } else {
            Intent i = new Intent(SplashScreen.this, SignInActivity.class);
            startActivity(i);
        }

        finish();
    }

}