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

device.takeSnapshot(reconnect=True).save('./screenshots/register/login-to-register.png','png')

vc = ViewClient(*ViewClient.connectToDeviceOrExit())
vc.dump()

button = vc.findViewByIdOrRaise('com.hoard.hoard:id/login_register_button')
button.touch()

vc.dump()

ViewClient.sleep(3)

device.takeSnapshot(reconnect=True).save('./screenshots/register/register-pre.png','png')

email = vc.findViewById('com.hoard.hoard:id/register_email')
email.type('u1@u1.com')

vc.dump()

password = vc.findViewById('com.hoard.hoard:id/register_password')
password.type('u1')

vc.dump()

password = vc.findViewById('com.hoard.hoard:id/register_password_confirmation')
password.type('u1')

device.takeSnapshot(reconnect=True).save('./screenshots/register/register-pos.png','png')

button = vc.findViewByIdOrRaise('com.hoard.hoard:id/register_button')
button.touch()

ViewClient.sleep(3)

device.takeSnapshot(reconnect=True).save('./screenshots/register/register-redirect.png','png')