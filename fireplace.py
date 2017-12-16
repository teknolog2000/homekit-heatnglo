import RPi.GPIO as GPIO
import time # sleep
import argparse


class HardwareIO(object):
    def toggle_onoff(self):
        pass

    def toggle_flame(self):
        pass

    def toggle_fan(self):
        pass


class TestIO(HardwareIO):
    def toggle_onoff(self):
        print 'toggle_onoff'

    def toggle_flame(self):
        print 'toggle_flame'

    def toggle_fan(self):
        print 'toggle_fan'


class GPIOIO(HardwareIO): # stupid name, yes
    # PIN numbers in GPIO.BOARD form
    PIN_FLAME = 31
    PIN_PILOT = 33
    PIN_ONOFF = 35
    PIN_FAN = 37

    def __init__(self):
        '''
        Initialize GPIO and pins associated with the Fireplace remote (see 
        definitions above)
        '''
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(self.PIN_FLAME, GPIO.OUT)
        #GPIO.setup(PIN_PILOT, GPIO.OUT) we don't need this
        GPIO.setup(self.PIN_ONOFF, GPIO.OUT)
        GPIO.setup(self.PIN_FAN, GPIO.OUT)
    
    def _blip_pin(self, pin):
        '''
        Toggles a pin briefly on and then off
        :param int pin: The pin number (see above)
        '''
        GPIO.output(pin, True)
        time.sleep(0.1)
        GPIO.output(pin, False)

    def toggle_onoff(self):
        '''
        Blips the ONOFF pin briefly.
        There is no way to read the current state.
        '''
        self._blip_pin(self.PIN_ONOFF)

    def toggle_flame(self):
        '''
        Blips the FLAME pin briefly.
        There is no way to read the current state.
        '''
        self._blip_pin(self.PIN_FLAME)

    def toggle_fan(self):
        '''
        Blips the FAN pin briefly.
        There is no way to read the current state.
        '''
        self._blip_pin(self.PIN_FAN)


class Fireplace(object):
    def __init__(self,hardware_io):
        self._hardware_io = hardware_io
        self._on = False
        self._flame_level = 0
        self._fan_level = 0
    
    def toggle_onoff(self):
        self._hardware_io.toggle_onoff()
        self._on = not self._on

    def set_flame(self, target_flame_level):
        for _ in range(0, target_flame_level - self._flame_level):
            self._hardware_io.toggle_onoff()
    
        self._flame_level = target_flame_level

    def set_fan(self, target_fan_level):
        for _ in range(0, target_fan_level - self._fan_level):
            self._hardware_io.toggle_flame()
    
        self._fan_level = target_fan_level


def main():
    parser = argparse.ArgumentParser(description='Fireplace management tool')
    parser.add_argument('command', choices=['onoff', 'flame', 'fan'])
    # parser.add_argument('--value', dest='accumulate', action='store_const',
    #                 const=sum, default=max,
    #                 help='sum the integers (default: find the max)')

    args = parser.parse_args()
    

    gpio = GPIOIO()

    fireplace = Fireplace(gpio)
    if args.command == 'onoff':
        fireplace.toggle_onoff()
    elif args.command == 'flame':
        fireplace.toggle_flame()
    elif args.command == 'fan':
        fireplace.toggle_fan()    

if __name__ == '__main__':
    main()
