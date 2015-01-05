package com.hoard.hoard;

/**
 * Created by AndreSilva on 21/10/14
 */

import android.animation.Animator;
import android.animation.AnimatorInflater;
import android.animation.AnimatorSet;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.hoard.hoard.api.Products;

import java.util.HashMap;
import java.util.Map;

public class MainActivity extends FragmentActivity {

    /**
     * Session
     */
    private Session session;

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

    /*
     * Menu View
     */
    private RelativeLayout menuView;
    private boolean menuDown = false;

    /**
     * Progress Indicator
     */
    private ProgressBar urlLoadProgressBar;
    private boolean visibility = false;

    /**
     * Internet Checker
     */
    private boolean isConnected = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        session = new Session(MainActivity.this);

        notificationBar = (RelativeLayout) findViewById(R.id.top_layout_notification_bar);
        TextView notificationTextView = (TextView) findViewById(R.id.notification_bar_text_edit);

        menuView = (RelativeLayout) findViewById(R.id.top_layout_menu);
        menuView.setVisibility(View.GONE);

        isConnected = isNetworkConnected();
        if(!isConnected) {
            notificationTextView.setText(getResources().getString(R.string.notification_no_connection));

            new NotificationShowDelayAsyncTask().execute();
            return;
        }

        if(getIntent().hasExtra("notification")) {
            notificationTextView.setText(getIntent().getStringExtra("notification"));

            new NotificationShowDelayAsyncTask().execute();
        }

        TextView menuLogOutTextView = (TextView) findViewById(R.id.top_layout_menu_logout);
        menuLogOutTextView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (menuDown) {
                    session.logOut();

                    Intent i = new Intent(MainActivity.this, SignInActivity.class);
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
                    Intent i = new Intent(MainActivity.this, ProfileActivity.class);
                    startActivity(i);
                }
            });
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
        viewPager.setOffscreenPageLimit(1);
        viewPager.setOnPageChangeListener(new ProductOnPageChangeListener());

        gestureDetector = new GestureDetector(this, new GestureDetector.SimpleOnGestureListener() {
            public void onLongPress(MotionEvent e) {
                Products products = ((ProductSlidePageFragment)((ScreenSlidePagerAdapter)viewPager.getAdapter()).getFragment(viewPager.getCurrentItem())).getProducts();
                Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(products.getResult().get(0).getLink()));
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
                        //Log.i("MainActivty>OnTouch: ", "DOWN");
                        visibility = true;
                        urlLoadProgressBar.setX(x-30);
                        urlLoadProgressBar.setY(y-30);
                        new ShowProgressBarAsyncTask().execute();
                        break;
                    case MotionEvent.ACTION_MOVE:
                        //Log.i("MainActivty>OnTouch: ", "MOVE");
                        visibility = false;
                        urlLoadProgressBar.setVisibility(View.GONE);
                        break;
                    case MotionEvent.ACTION_UP:
                        //Log.i("MainActivty>OnTouch: ", "UP");
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
                if (menuDown) {
                    AnimatorSet menuUp = (AnimatorSet) AnimatorInflater.loadAnimator(MainActivity.this, R.animator.menu_up);
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
                    AnimatorSet menuDown = (AnimatorSet) AnimatorInflater.loadAnimator(MainActivity.this, R.animator.menu_down);
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

        ImageButton favoritesButton = (ImageButton) findViewById(R.id.favorite_button);

        favoritesButton.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                Intent i = new Intent(MainActivity.this, FavoriteActivity.class);
                startActivity(i);
            }
        });
    }

    /**
     * Checks if the application has internet connection
     */
    private boolean isNetworkConnected() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        return (cm.getActiveNetworkInfo() != null);
    }

    /**
     * AsyncTask Class for delaying show notification
     */
    class NotificationShowDelayAsyncTask extends AsyncTask<String, String, String> {

        @Override
        protected String doInBackground(String... strings) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.interrupted();
                e.printStackTrace();
            }
            return null;
        }

        @Override
        protected void onPostExecute(String string) {

            Animation anim = AnimationUtils.loadAnimation(MainActivity.this, R.anim.notification_down);
            anim.setAnimationListener(new Animation.AnimationListener() {
                @Override
                public void onAnimationStart(Animation animation) {}

                @Override
                public void onAnimationEnd(Animation animation) {
                    new NotificationHideDelayAsyncTask().execute();
                }

                @Override
                public void onAnimationRepeat(Animation animation) {}
            });

            notificationBar.startAnimation(anim);
        }
    }

    /**
     * AsyncTask Class for delaying hide notification
     */
    class NotificationHideDelayAsyncTask extends AsyncTask<String, String, String> {

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

            if(!isConnected) {
                new CloseApplicationAsyncTask().execute();
            }
        }
    }

    /**
     * AsyncTask Class for closing the application.
     */
    class CloseApplicationAsyncTask extends AsyncTask<String, String, String> {

        @Override
        protected String doInBackground(String... strings) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.interrupted();
                e.printStackTrace();
            }
            return null;
        }

        @Override
        protected void onPostExecute(String string) {
            session.logOut();

            Intent i = new Intent(MainActivity.this, SignInActivity.class);
            i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(i);
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
            if (visibility) {
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
    private class ScreenSlidePagerAdapter extends FragmentPagerAdapter {
        private Map<Integer, String> mFragmentTags;
        private FragmentManager mFragmentManager;

        public ScreenSlidePagerAdapter(FragmentManager fm) {
            super(fm);
            mFragmentManager = fm;
            mFragmentTags = new HashMap<Integer, String>();
        }

        @Override
        public Fragment getItem(int position) {
            Log.i("MainActivity>ScreenSlidePagerAdapter:getItem", " " + position);
            return new ProductSlidePageFragment();
        }

        @Override
        public Object instantiateItem(ViewGroup container, int position) {
            Object obj = super.instantiateItem(container, position);
            if (obj instanceof Fragment) {
                // record the fragment tag here.
                Fragment f = (Fragment) obj;
                String tag = f.getTag();
                mFragmentTags.put(position, tag);
            }
            return obj;
        }

        @Override
        public int getCount() {
            return Integer.MAX_VALUE;
        }

        public Fragment getFragment(int position) {
            String tag = mFragmentTags.get(position);
            if (tag == null)
                return null;
            return mFragmentManager.findFragmentByTag(tag);
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
