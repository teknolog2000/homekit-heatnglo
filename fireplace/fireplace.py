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
            print 'toggling flame'
            self._hardware_io.toggle_flame()
    
        self._flame_level = target_flame_level

    def set_fan(self, target_fan_level):
        for _ in range(0, target_fan_level - self._fan_level):
            self._hardware_io.toggle_fan()
    
        self._fan_level = target_fan_level