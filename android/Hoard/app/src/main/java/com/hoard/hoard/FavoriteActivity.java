package com.hoard.hoard;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.GridView;
import android.widget.ProgressBar;

import com.hoard.hoard.api.Favorites;
import com.hoard.hoard.api.HoardAPI;
import com.hoard.hoard.api.Product;

/**
 * Created by AndreSilva on 19/11/14
 */

public class FavoriteActivity extends Activity {

    /*
     * Hoard Api
     */
    private HoardAPI hoardAPI;

    /*
     * Favorites
     */
    private Favorites favorites;

    /*
     * Grid
     */
    private GridView gridView;

    /*
     * ProgressBar
     */
    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.favorite_layout);

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

        new FavoritesAsyncTask().execute();
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
