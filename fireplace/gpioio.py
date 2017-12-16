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