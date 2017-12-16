import pytest

class TestIO(HardwareIO):
    def toggle_onoff(self):
        print 'toggle_onoff'

    def toggle_flame(self):
        print 'toggle_flame'

    def toggle_fan(self):
        print 'toggle_fan'


def test_init():
    test_io = TestIO()
    