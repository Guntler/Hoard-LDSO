import sys

sys.path.append('./AndroidViewClient/src')

from com.dtmilano.android.viewclient import ViewClient, TextView, EditText

device, serialno = ViewClient.connectToDeviceOrExit()

# sets a variable with the package's internal name
package = 'com.hoard.hoard'

# sets a variable with the name of an Activity in the package
activity = 'com.hoard.hoard.SplashScreen'

# sets the name of the component to start
runComponent = package + '/' + activity

# Runs the component
device.startActivity(component=runComponent)

ViewClient.sleep(1)

device.takeSnapshot(reconnect=True).save('./screenshots/favorites/favorites-pre.png','png')

vc = ViewClient(*ViewClient.connectToDeviceOrExit())
vc.dump()

email = vc.findViewById('com.hoard.hoard:id/login_email')
email.type('u1@u.com')

vc.dump()

password = vc.findViewById('com.hoard.hoard:id/login_password')
password.type('u1')

button = vc.findViewByIdOrRaise('com.hoard.hoard:id/login_button')
button.touch()

vc.dump()

device.takeSnapshot(reconnect=True).save('./screenshots/favorites/login-pos.png','png')

ViewClient.sleep(3)

device.takeSnapshot(reconnect=True).save('./screenshots/favorites/favorites-redirect.png','png')

button = vc.findViewByIdOrRaise('com.hoard.hoard:id/favorite_button')
button.touch()

vc.dump()

ViewClient.sleep(3)

device.takeSnapshot(reconnect=True).save('./screenshots/favorites/favorites-pos.png','png')