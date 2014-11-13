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
    private EditText emailEditText, passwordEditText, passwordConfirmationEditText;

    /*
     * Input Validator
     */
    private Validation validator;

    /*
     * Register Button
     */
    private ImageButton registerButton;

    /*
     * Progress Bar
     */
    private ProgressBar progressBar;

    /*
     * API Class
     */
    private HoardAPI hoardAPI;
    private Boolean valid = false;

    /*
     * Alert Dialog
     */
    private AlertDialog alertDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        hoardAPI = new HoardAPI(this);

        emailEditText = (EditText) findViewById(R.id.register_email);
        passwordEditText = (EditText) findViewById(R.id.register_password);
        passwordConfirmationEditText = (EditText) findViewById(R.id.register_password_confirmation);

        validator = new Validation();

        registerButton = (ImageButton) findViewById(R.id.register_button);
        registerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String email = emailEditText.getText().toString();
                String password = passwordEditText.getText().toString();
                String passwordConfirmation = passwordConfirmationEditText.getText().toString();

                if(validator.isValidEmail(email)){
                    if(validator.isValidPassword(password)) {
                        if(validator.isValidPasswordConfirmation(password, passwordConfirmation)) {
                            registerButton.setVisibility(View.GONE);
                            progressBar.setVisibility(View.VISIBLE);
                            new RegisterAsyncTask().execute();
                        } else {
                            passwordConfirmationEditText.setError(getResources().getString(R.string.validation_confirmation_password_error));
                        }
                    } else {
                        passwordEditText.setError(getResources().getString(R.string.validation_password_error));
                    }
                } else {
                    emailEditText.setError(getResources().getString(R.string.validation_email_error));
                }
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
                Log.i("RegisterActivity>RegisterAsyncTask: Username - ", emailEditText.getText().toString());
                Log.i("RegisterActivity>RegisterAsyncTask: Password - ", passwordEditText.getText().toString());
                valid = hoardAPI.registerEmailPassword(emailEditText.getText().toString(), passwordEditText.getText().toString());

            } catch (Exception e) {
                String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
                Log.e("RegisterActivity>RegisterAsyncTask>doInBackground>Exception:", errorMessage);
            }

            return null;
        }

        protected void onPostExecute(String file_url) {
            if(valid) {
                Intent i = new Intent(RegisterActivity.this, MainActivity.class);
                Bundle bundle = new Bundle();
                bundle.putString("notification", getResources().getString(R.string.notification_register));
                i.putExtras(bundle);
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