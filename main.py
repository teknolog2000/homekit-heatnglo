import time # sleep
import argparse
from fireplace import *
from fireplace.gpioio import GPIOIO


def main():
    parser = argparse.ArgumentParser(description='Fireplace management tool')
    parser.add_argument('command', choices=['onoff', 'flame', 'fan'])
    parser.add_argument('--value', help='set the value', type=int)

    args = parser.parse_args()

    gpio = GPIOIO()
    fireplace = Fireplace(gpio)

    if args.command == 'onoff':
        fireplace.toggle_onoff()
    elif args.command == 'flame':
        print 'setting flame'
        fireplace.set_flame(args.value)
    elif args.command == 'fan':
        print 'setting fan'
        fireplace.set_fan(args.value)    


if __name__ == '__main__':
    main()
