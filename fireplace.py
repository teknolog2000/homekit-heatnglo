import RPi.GPIO as GPIO
import time # sleep
import argparse

# PIN numbers in GPIO.BOARD form
PIN_FLAME = 31
PIN_PILOT = 33
PIN_ONOFF = 35
PIN_FAN = 37

def init_gpio():
    '''
    Initialize GPIO and pins associated with the Fireplace remote (see 
    definitions above)
    '''
    #GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(PIN_FLAME, GPIO.OUT)
    #GPIO.setup(PIN_PILOT, GPIO.OUT) we don't need this
    GPIO.setup(PIN_ONOFF, GPIO.OUT)
    GPIO.setup(PIN_FAN, GPIO.OUT)

def blip_pin(pin):
    '''
    Toggles a pin briefly on and then off
    :param int pin: The pin number (see above)
    '''
    GPIO.output(pin, True)
    time.sleep(0.1)
    GPIO.output(pin, False)

def toggle_onoff():
    '''
    Blips the ONOFF pin briefly.
    There is no way to read the current state.
    '''
    blip_pin(PIN_ONOFF)

def toggle_flame():
    '''
    Blips the FLAME pin briefly.
    There is no way to read the current state.
    '''
    blip_pin(PIN_FLAME)

def toggle_fan():
    '''
    Blips the FAN pin briefly.
    There is no way to read the current state.
    '''
    blip_pin(PIN_FAN)

def main():
    parser = argparse.ArgumentParser(description='Fireplace management tool')
    parser.add_argument('command', choices=['onoff', 'flame', 'fan'])
    # parser.add_argument('--value', dest='accumulate', action='store_const',
    #                 const=sum, default=max,
    #                 help='sum the integers (default: find the max)')

    args = parser.parse_args()
    
    init_gpio()
    if args.command == 'onoff':
        toggle_onoff()
    elif args.command == 'flame':
        toggle_flame()
    elif args.command == 'fan':
        toggle_fan()    

if __name__ == '__main__':
    main()
