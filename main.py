import RPi.GPIO as GPIO
import time # sleep
import argparse
from fireplace import *


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
