import pytest
from fireplace import Fireplace, HardwareIO

class TestIO(HardwareIO):
    def toggle_onoff(self):
        print 'toggle_onoff'

    def toggle_flame(self):
        print 'toggle_flame'

    def toggle_fan(self):
        print 'toggle_fan'


def test_init():
    test_io = TestIO()
    fireplace = Fireplace(test_io)

def test_toggle_onoff():
    test_io = TestIO()
    fireplace = Fireplace(test_io)

    assert fireplace._on == False
    fireplace.toggle_onoff()
    assert fireplace._on == True
    

def test_toggle_flame():
    test_io = TestIO()
    fireplace = Fireplace(test_io)

    TARGET = 3

    assert fireplace._flame_level == 0
    fireplace.set_flame(TARGET)
    assert fireplace._flame_level == TARGET


def test_toggle_fan():
    test_io = TestIO()
    fireplace = Fireplace(test_io)

    TARGET = 3

    assert fireplace._fan_level == 0
    fireplace.set_fan(TARGET)
    assert fireplace._fan_level == TARGET