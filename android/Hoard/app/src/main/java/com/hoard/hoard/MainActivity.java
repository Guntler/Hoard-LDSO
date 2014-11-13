package com.hoard.hoard;

/**
 * Created by AndreSilva on 21/10/14
 */

import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentStatePagerAdapter;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends FragmentActivity {

    /**
     * View Pager Stuff
     */
    private ViewPager viewPager;

    /**
     * GestureDetector
     */
    private GestureDetector gestureDetector;

    /*
     * Notification View Bar
     */
    private RelativeLayout notificationBar;
    private TextView notificationEditText;

    /**
     * Progress Indicator
     */
    private ProgressBar urlLoadProgressBar;
    private boolean visibility = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        notificationBar = (RelativeLayout) findViewById(R.id.top_layout_notification_bar);
        notificationEditText = (TextView) findViewById(R.id.notification_bar_text_edit);

        if(getIntent().hasExtra("notification")) {
            startNotificationWithNotification(getIntent().getStringExtra("notification"));
        }

        /*
         Instantiate ViewPager and ProgressBar.
         */
        viewPager = (ViewPager) findViewById(R.id.pager);
        urlLoadProgressBar = (ProgressBar) findViewById(R.id.url_load_progress_bar);

        /*
         The pager adapter, which provides the pages to the view pager widget.
         */
        PagerAdapter mPagerAdapter = new ScreenSlidePagerAdapter(getSupportFragmentManager());
        viewPager.setAdapter(mPagerAdapter);
        viewPager.setOnPageChangeListener(new ProductOnPageChangeListener());

        gestureDetector = new GestureDetector(getApplicationContext(), new GestureDetector.SimpleOnGestureListener() {
            public void onLongPress(MotionEvent e) {
                Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("http://www.thisiswhyimbroke.com/new/"));
                startActivity(browserIntent);
                urlLoadProgressBar.setVisibility(View.GONE);
            }
        });

        viewPager.setOnTouchListener(new View.OnTouchListener() {

            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                float x = motionEvent.getX(), y = motionEvent.getY();
                int action = motionEvent.getAction();

                switch (action) {
                    case MotionEvent.ACTION_DOWN:
                        Log.i("MainActivty>OnTouch: ", "DOWN");
                        visibility = true;
                        urlLoadProgressBar.setX(x-30);
                        urlLoadProgressBar.setY(y-30);
                        new ShowProgressBarAsyncTask().execute();
                        break;
                    case MotionEvent.ACTION_MOVE:
                        Log.i("MainActivty>OnTouch: ", "MOVE");
                        visibility = false;
                        urlLoadProgressBar.setVisibility(View.GONE);
                        break;
                    case MotionEvent.ACTION_UP:
                        Log.i("MainActivty>OnTouch: ", "UP");
                        visibility = false;
                        urlLoadProgressBar.setVisibility(View.GONE);
                        break;
                }

                return gestureDetector.onTouchEvent(motionEvent);
            }
        });

        /*
         Instantiate the buttons from the view.
         */
        ImageButton settings = (ImageButton) findViewById(R.id.settings_button);

        settings.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Toast.makeText(getApplicationContext(), "Settings",
                        Toast.LENGTH_LONG).show();

            }
        });

        ImageButton favorites = (ImageButton) findViewById(R.id.favorite_button);

        favorites.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Toast.makeText(getApplicationContext(), "Favorites",
                        Toast.LENGTH_LONG).show();
            }
        });
    }

    private void startNotificationWithNotification(String notification) {
        notificationEditText.setText(notification);

        Animation anim = AnimationUtils.loadAnimation(MainActivity.this, R.anim.notification_down);
        anim.setAnimationListener(new Animation.AnimationListener() {
            @Override
            public void onAnimationStart(Animation animation) {}

            @Override
            public void onAnimationEnd(Animation animation) {
                new NotificationAsyncTask().execute();
            }

            @Override
            public void onAnimationRepeat(Animation animation) {}
        });

        notificationBar.startAnimation(anim);
    }

    /**
     * AsyncTask Class for delaying hide notification
     */
    class NotificationAsyncTask extends AsyncTask<String, String, String> {

        @Override
        protected String doInBackground(String... strings) {
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.interrupted();
                e.printStackTrace();
            }
            return null;
        }

        @Override
        protected void onPostExecute(String string) {
            Animation anim = AnimationUtils.loadAnimation(MainActivity.this, R.anim.notification_up);
            notificationBar.startAnimation(anim);
        }
    }

    /**
     * AsyncTask Class for delaying the progress bar appearance.
     */
    class ShowProgressBarAsyncTask extends AsyncTask<String, String, String> {

        @Override
        protected String doInBackground(String... strings) {
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
                Thread.interrupted();
                e.printStackTrace();
            }
            return null;
        }

        @Override
        protected void onPostExecute(String string) {
            if(visibility) {
                Log.i("Here", "h");
                urlLoadProgressBar.setVisibility(View.VISIBLE);
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (viewPager.getCurrentItem() == 0) {
            // If the user is currently looking at the first step, allow the system to handle the
            // Back button. This calls finish() on this activity and pops the back stack.
            super.onBackPressed();
        } else {
            // Otherwise, select the previous step.
            viewPager.setCurrentItem(viewPager.getCurrentItem() - 1);
        }
    }

    /**
     * A simple pager adapter that represents ScreenSlidePageFragment objects, in sequence.
     */
    private class ScreenSlidePagerAdapter extends FragmentStatePagerAdapter {
        public ScreenSlidePagerAdapter(FragmentManager fm) {
            super(fm);
        }

        @Override
        public Fragment getItem(int position) {
            Log.i("MainActivity>ScreenSlidePagerAdapter:getItem", " " + position);
            return new ProductSlidePageFragment();
        }

        @Override
        public int getCount() {
            return Integer.MAX_VALUE;
        }
    }

    /**
     * Get the current view position from the ViewPager.
     */
    public static class ProductOnPageChangeListener extends ViewPager.SimpleOnPageChangeListener {
        private int currentPage;

        @Override
        public void onPageSelected(int position) {
            // current page from the actual position
            currentPage = position;
            Log.i("MainActivity>ProductOnPageChangeListener:onPageSelected", " " + currentPage);
        }
    }
}
