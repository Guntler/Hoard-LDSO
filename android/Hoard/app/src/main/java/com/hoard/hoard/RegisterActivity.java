package com.hoard.hoard;

/**
 * Created by AndreSilva on 29/10/14
 */

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ProgressBar;

import com.hoard.hoard.api.HoardAPI;

public class RegisterActivity extends Activity {

    /*
     * Edit Texts Email Password
     */
    EditText email, password;

    /*
     * Register Button
     */
    ImageButton registerButton;

    /*
     * Progress Bar
     */
    ProgressBar progressBar;

    /*
     * API Class
     */
    HoardAPI hoardAPI;
    Boolean valid = false;

    /*
     * Alert Dialog
     */
    AlertDialog alertDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        hoardAPI = new HoardAPI(this);

        email = (EditText) findViewById(R.id.register_email);
        password = (EditText) findViewById(R.id.register_password);

        registerButton = (ImageButton) findViewById(R.id.register_button);
        registerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                registerButton.setVisibility(View.GONE);
                progressBar.setVisibility(View.VISIBLE);
                new RegisterAsyncTask().execute();
            }
        });

        progressBar = (ProgressBar) findViewById(R.id.register_progress_bar);

        AlertDialog.Builder builder = new AlertDialog.Builder(RegisterActivity.this);
        builder.setMessage(R.string.dialog_fail_register_message)
                .setTitle(R.string.dialog_fail_register_title);
        builder.setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                // User clicked OK button
            }
        });

        alertDialog = builder.create();
    }

    @Override
    public void onDestroy(){
        super.onDestroy();

        alertDialog.dismiss();
    }

    class RegisterAsyncTask extends AsyncTask<String, String, String> {

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
        }

        protected String doInBackground(String... args) {
            try {
                Log.i("RegisterActivity>RegisterAsyncTask: Username - ", email.getText().toString());
                Log.i("RegisterActivity>RegisterAsyncTask: Password - ", password.getText().toString());
                valid = hoardAPI.registerEmailPassword(email.getText().toString(), password.getText().toString());

            } catch (Exception e) {
                String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
                Log.e("RegisterActivity>RegisterAsyncTask>doInBackground>Exception:", errorMessage);
            }

            return null;
        }

        protected void onPostExecute(String file_url) {
            if(valid) {
                Intent i = new Intent(RegisterActivity.this, MainActivity.class);
                i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(i);

                finish();
            } else {
                progressBar.setVisibility(View.GONE);
                registerButton.setVisibility(View.VISIBLE);

                alertDialog.show();
            }
        }
    }
}