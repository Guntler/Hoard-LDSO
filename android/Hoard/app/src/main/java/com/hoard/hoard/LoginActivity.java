package com.hoard.hoard;

/**
 * Created by AndreSilva on 29/10/14
 */

import android.app.Activity;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ProgressBar;

import com.hoard.hoard.api.HoardAPI;

public class LoginActivity extends Activity {

    /*
     * Edit Texts Email Password
     */
    EditText email, password;

    /*
     * Log In Button
     */
    ImageButton logInButton;

    /*
     * Progress Bar
     */
    ProgressBar progressBar;

    /*
     * API Class
     */
    HoardAPI hoardAPI;
    Boolean valid = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        hoardAPI = new HoardAPI(this);

        email = (EditText) findViewById(R.id.login_email);
        password = (EditText) findViewById(R.id.login_password);

        logInButton = (ImageButton) findViewById(R.id.login_button);
        logInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                logInButton.setVisibility(View.GONE);
                progressBar.setVisibility(View.VISIBLE);
                new CheckLoginAsyncTask().execute();
            }
        });

        progressBar = (ProgressBar) findViewById(R.id.login_progress_bar);
    }


    class CheckLoginAsyncTask extends AsyncTask<String, String, String> {

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
        }

        protected String doInBackground(String... args) {
            try {
                Log.i("LoginActivity>CheckLoginAsyncTask: Username - ", email.getText().toString());
                Log.i("LoginActivity>CheckLoginAsyncTask: Password - ", password.getText().toString());
                valid = hoardAPI.checkLoginForEmailPassword(email.getText().toString(), password.getText().toString());

            } catch (Exception e) {
                String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
                Log.e("ListViewFragment>doInBackground>Exception:", errorMessage);
            }

            return null;
        }

        protected void onPostExecute(String file_url) {
            if(valid) {
                Intent i = new Intent(LoginActivity.this, MainActivity.class);
                startActivity(i);

                finish();
            } else {
                progressBar.setVisibility(View.GONE);
                logInButton.setVisibility(View.VISIBLE);
            }
        }
    }
}