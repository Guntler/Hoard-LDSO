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
import android.util.Pair;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.hoard.hoard.api.HoardAPI;

public class SignInActivity extends Activity {

    /*
     * Edit Texts Email Password
     */
    private EditText emailEditText, passwordEditText;

    /*
     * Input Validator
     */
    private Validation validator;

    /*
     * Log In and  Register Buttons
     */
    private ImageButton logInButton;

    /*
     * Progress Bar
     */
    private ProgressBar progressBar;

    /*
     * API Class and Handler Valid
     */
    private HoardAPI hoardAPI;
    private Pair<Boolean, String> valid;

    /*
     * Alert Dialog
     */
    private AlertDialog alertDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sigin);

        hoardAPI = new HoardAPI(SignInActivity.this);

        emailEditText = (EditText) findViewById(R.id.signin_email);
        emailEditText.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View view, boolean hasFocus) {
                if (hasFocus)
                    emailEditText.setHint("");
                else
                    emailEditText.setHint(getResources().getString(R.string.hint_email));
            }
        });
        passwordEditText = (EditText) findViewById(R.id.signin_password);
        passwordEditText.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View view, boolean hasFocus) {
                if(hasFocus)
                    passwordEditText.setHint("");
                else
                    passwordEditText.setHint(getResources().getString(R.string.hint_password));
            }
        });
        passwordEditText.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId,
                                          KeyEvent event) {
                if (actionId == EditorInfo.IME_ACTION_DONE) {
                    logInButton.performClick();
                    return true;
                }
                return false;
            }
        });

        validator = new Validation();

        TextView recoverTextView = (TextView) findViewById(R.id.signin_recovery);
        recoverTextView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });

        logInButton = (ImageButton) findViewById(R.id.signin_button);
        logInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(validator.isValidEmail(emailEditText.getText().toString())){
                    if(validator.isValidPassword(passwordEditText.getText().toString())) {
                        logInButton.setVisibility(View.GONE);
                        progressBar.setVisibility(View.VISIBLE);
                        new SignInAsyncTask().execute();
                    } else {
                        passwordEditText.setError(getResources().getString(R.string.validation_password_error));
                    }
                } else {
                    emailEditText.setError(getResources().getString(R.string.validation_email_error));
                }
            }
        });

        Button registerButton = (Button) findViewById(R.id.signin_register_button);
        registerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(SignInActivity.this, RegisterActivity.class);
                startActivity(i);
            }
        });

        progressBar = (ProgressBar) findViewById(R.id.signin_progress_bar);

        AlertDialog.Builder builder = new AlertDialog.Builder(SignInActivity.this);
        builder.setMessage(R.string.dialog_fail_login_message)
                .setTitle(R.string.dialog_fail_login_title);
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


    class SignInAsyncTask extends AsyncTask<String, String, String> {

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
        }

        protected String doInBackground(String... args) {
            try {
                Log.i("LoginActivity>SignInAsyncTask: Username - ", emailEditText.getText().toString());
                Log.i("LoginActivity>SignInAsyncTask: Password - ", passwordEditText.getText().toString());
                valid = hoardAPI.signInUser(emailEditText.getText().toString(), passwordEditText.getText().toString());

            } catch (Exception e) {
                String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
                Log.e("LoginActivity>SignInAsyncTask>doInBackground>Exception:", errorMessage);
            }

            return null;
        }

        protected void onPostExecute(String notUsed) {
            if(valid.first) {

                Intent i = new Intent(SignInActivity.this, MainActivity.class);
                Bundle bundle = new Bundle();
                bundle.putString("notification", getResources().getString(R.string.notification_signin));
                i.putExtras(bundle);
                startActivity(i);

                finish();
            } else {
                progressBar.setVisibility(View.GONE);
                logInButton.setVisibility(View.VISIBLE);
                alertDialog.setMessage(valid.second);
                alertDialog.show();
            }
        }
    }

    class RecoverAsyncTask extends AsyncTask<String, String, String> {

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
        }

        protected String doInBackground(String... args) {
            try {
                Log.i("SignInActivity>SignInAsyncTask: Email - ", emailEditText.getText().toString());
                //valid = hoardAPI.recoverPassword(emailEditText.getText().toString());

            } catch (Exception e) {
                String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
                Log.e("SignInActivity>RecoverAsyncTask>doInBackground>Exception:", errorMessage);
            }

            return null;
        }

        protected void onPostExecute(String notUsed) {
            if(valid.first) {
                Intent i = new Intent(SignInActivity.this, MainActivity.class);
                Bundle bundle = new Bundle();
                bundle.putString("notification", getResources().getString(R.string.notification_signin));
                i.putExtras(bundle);
                startActivity(i);

                finish();
            } else {
                progressBar.setVisibility(View.GONE);
                logInButton.setVisibility(View.VISIBLE);
                alertDialog.setMessage(valid.second);
                alertDialog.show();
            }
        }
    }
}