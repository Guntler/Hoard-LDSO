package com.hoard.hoard;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.net.ConnectivityManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.util.Pair;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.hoard.hoard.api.HoardAPI;

/**
 * Created by AndreSilva on 29/12/14
 */

public class ProfileActivity extends Activity {

    /*
     * Edit Texts Email Password
     */
    private EditText passwordOldEditText, passwordNewEditText, passwordConfirmationEditText;

    /*
     * Input Validator
     */
    private Validation validator;

    /*
     * Change Password Button
     */
    private ImageButton changePasswordButton;

    /*
     * Progress Bar
     */
    private ProgressBar progressBar;

    /*
     * API Class
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
        setContentView(R.layout.activity_profile);

        if(!isNetworkConnected()) {
            finish();
            return;
        }

        hoardAPI = new HoardAPI(ProfileActivity.this);

        passwordOldEditText = (EditText) findViewById(R.id.profile_old_password);
        passwordOldEditText.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View view, boolean hasFocus) {
                if (hasFocus)
                    passwordOldEditText.setHint("");
                else
                    passwordOldEditText.setHint(getResources().getString(R.string.hint_old_password));
            }
        });

        passwordNewEditText = (EditText) findViewById(R.id.profile_password);
        passwordNewEditText.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View view, boolean hasFocus) {
                if (hasFocus)
                    passwordNewEditText.setHint("");
                else
                    passwordNewEditText.setHint(getResources().getString(R.string.hint_new_password));
            }
        });

        passwordConfirmationEditText = (EditText) findViewById(R.id.profile_password_confirmation);
        passwordConfirmationEditText.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View view, boolean hasFocus) {
                if(hasFocus)
                    passwordConfirmationEditText.setHint("");
                else
                    passwordConfirmationEditText.setHint(getResources().getString(R.string.hint_confirm_password));
            }
        });
        passwordConfirmationEditText.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId,
                                          KeyEvent event) {
                if (actionId == EditorInfo.IME_ACTION_DONE) {
                    changePasswordButton.performClick();
                    return true;
                }
                return false;
            }
        });

        validator = new Validation();

        changePasswordButton = (ImageButton) findViewById(R.id.profile_button);
        changePasswordButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String passwordOld = passwordOldEditText.getText().toString();
                String passwordNew = passwordNewEditText.getText().toString();
                String passwordConfirmation = passwordConfirmationEditText.getText().toString();

                if(validator.isValidPassword(passwordOld)){
                    if(validator.isValidPassword(passwordNew)) {
                        if(validator.isValidPasswordConfirmation(passwordNew, passwordConfirmation)) {
                            changePasswordButton.setVisibility(View.GONE);
                            progressBar.setVisibility(View.VISIBLE);
                            new ChangePasswordAsyncTask().execute();
                        } else {
                            passwordConfirmationEditText.setError(getResources().getString(R.string.validation_confirmation_password_error));
                        }
                    } else {
                        passwordNewEditText.setError(getResources().getString(R.string.validation_password_error));
                    }
                } else {
                    passwordOldEditText.setError(getResources().getString(R.string.validation_password_error));
                }
            }
        });

        progressBar = (ProgressBar) findViewById(R.id.profile_progress_bar);

        AlertDialog.Builder builder = new AlertDialog.Builder(ProfileActivity.this);
        builder.setMessage(R.string.dialog_fail_change_password_message)
                .setTitle(R.string.dialog_fail_change_password_title);
        builder.setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                // User clicked OK button
            }
        });

        alertDialog = builder.create();
    }

    /**
     * Checks if the application has internet connection
     */
    private boolean isNetworkConnected() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        return (cm.getActiveNetworkInfo() != null);
    }

    class ChangePasswordAsyncTask extends AsyncTask<String, String, String> {

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
        }

        protected String doInBackground(String... args) {
            try {
                valid = hoardAPI.changePassword(passwordOldEditText.getText().toString(), passwordConfirmationEditText.getText().toString());
            } catch (Exception e) {
                String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
                Log.e("ProfileActivity>ChangePasswordAsyncTask>doInBackground>Exception:", errorMessage);
            }
            return null;
        }

        protected void onPostExecute(String notUsed) {
            if(valid.first)
                alertDialog.setTitle("Success");
            else
                alertDialog.setTitle("Failed");
            passwordOldEditText.setText("");
            passwordNewEditText.setText("");
            passwordConfirmationEditText.setText("");
            progressBar.setVisibility(View.GONE);
            changePasswordButton.setVisibility(View.VISIBLE);
            alertDialog.setMessage(valid.second);
            alertDialog.show();
        }
    }
}
