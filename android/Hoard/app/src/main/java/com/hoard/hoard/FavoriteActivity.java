package com.hoard.hoard;

import android.animation.Animator;
import android.animation.AnimatorInflater;
import android.animation.AnimatorSet;
import android.app.Activity;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.GridView;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.hoard.hoard.api.Products;
import com.hoard.hoard.api.HoardAPI;
import com.hoard.hoard.api.Product;

/**
 * Created by AndreSilva on 19/11/14
 */

public class FavoriteActivity extends Activity {

    /**
     * Session
     */
    private Session session;

    /*
     * Hoard Api
     */
    private HoardAPI hoardAPI;

    /*
     * Favorites
     */
    private Products favorites;

    /*
     * Grid
     */
    private GridView gridView;

    /*
     * ProgressBar
     */
    private ProgressBar progressBar;

    /*
     * Menu View
     */
    private RelativeLayout menuView;
    private boolean menuDown = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.favorite_layout);

        if(!isNetworkConnected()) {
            finish();
            return;
        }

        hoardAPI = new HoardAPI(this);

        gridView = (GridView)findViewById(R.id.favorite_grid);
        gridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {

                Product product = (Product) gridView.getAdapter().getItem(position);

                Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(product.getLink()));
                startActivity(browserIntent);
            }
        });

        progressBar = (ProgressBar)findViewById(R.id.favorite_progressbar);
        progressBar.setVisibility(View.VISIBLE);

        session = new Session(FavoriteActivity.this);

        TextView menuLogOutTextView = (TextView) findViewById(R.id.top_layout_menu_logout);
        menuLogOutTextView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (menuDown) {
                    session.logOut();

                    Intent i = new Intent(FavoriteActivity.this, SignInActivity.class);
                    i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(i);
                }
            }
        });

        if(session.checkSessionForUser()) {
            TextView menuProfileTextView = (TextView) findViewById(R.id.top_layout_menu_profile);
            menuProfileTextView.setText(session.getUserEmail());
            menuProfileTextView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Intent i = new Intent(FavoriteActivity.this, ProfileActivity.class);
                    startActivity(i);
                }
            });
        }

        menuView = (RelativeLayout) findViewById(R.id.top_layout_menu);
        menuView.setVisibility(View.GONE);

        /*
         Instantiate the buttons from the view.
         */
        ImageButton settings = (ImageButton) findViewById(R.id.settings_button);

        settings.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                if (menuDown) {
                    AnimatorSet menuUp = (AnimatorSet) AnimatorInflater.loadAnimator(FavoriteActivity.this, R.animator.menu_up);
                    menuUp.setTarget(menuView);
                    menuUp.addListener(new Animator.AnimatorListener() {
                        @Override
                        public void onAnimationStart(Animator animator) {
                        }

                        @Override
                        public void onAnimationEnd(Animator animator) {

                        }

                        @Override
                        public void onAnimationCancel(Animator animator) {

                        }

                        @Override
                        public void onAnimationRepeat(Animator animator) {

                        }
                    });
                    menuUp.start();
                } else {
                    AnimatorSet menuDown = (AnimatorSet) AnimatorInflater.loadAnimator(FavoriteActivity.this, R.animator.menu_down);
                    menuDown.setTarget(menuView);
                    menuDown.addListener(new Animator.AnimatorListener() {
                        @Override
                        public void onAnimationStart(Animator animator) {
                            menuView.setVisibility(View.VISIBLE);
                        }

                        @Override
                        public void onAnimationEnd(Animator animator) {

                        }

                        @Override
                        public void onAnimationCancel(Animator animator) {

                        }

                        @Override
                        public void onAnimationRepeat(Animator animator) {

                        }
                    });
                    menuDown.start();
                }

                menuDown = !menuDown;
            }
        });

        ImageButton backButton = (ImageButton) findViewById(R.id.back_button);

        backButton.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                FavoriteActivity.this.finish();
            }
        });

        new FavoritesAsyncTask().execute();
    }

    /**
     * Checks if the application has internet connection
     */
    private boolean isNetworkConnected() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        return (cm.getActiveNetworkInfo() != null);
    }

    class FavoritesAsyncTask extends AsyncTask<String, String, String> {

        @Override
        protected String doInBackground(String... strings) {
            try {
                favorites = hoardAPI.getFavorites();

                if(favorites != null)
                    for(Product prod : favorites.getResult()) {
                        Log.d("Product: ", prod.getName() + " link - " + prod.getImageName());
                    }

            } catch (Exception e) {
                String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
                Log.e("FavoriteActivity>FavoritesAsyncTask>doInBackground>Exception:", errorMessage);
            }

            return null;
        }

        @Override
        protected void onPostExecute(String notUsed) {
            if(favorites != null)
                gridView.setAdapter(new ProductAdapter(FavoriteActivity.this, favorites.getResult()));
            progressBar.setVisibility(View.GONE);
        }
    }
}
