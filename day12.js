const readInput = require('./utils/readInput');

readInput(12, input => {
  const navigationActions = input.trim().split('\n').map(str => {
    const command = str.slice(0, 1);
    const value = Number(str.slice(1));

    return {command, value};
  });

  const CARDINAL_DIRECTIONS = {
    'N': 'N',
    'E': 'E',
    'S': 'S',
    'W': 'W',
  };

  const ROTATION_DIRECTIONS = {
    'L': 'L',
    'R': 'R'
  };

  const ACTIONS = {
    ...CARDINAL_DIRECTIONS,
    ...ROTATION_DIRECTIONS,
    'F': 'F' // Forward
  };

  const DEGREES_BY_DIRECTION = {
    'N': 0,
    'E': 90,
    'S': 180,
    'W': 270,
  };

  class Coordinate {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    setCoordinates(x, y) {
      this.x = x;
      this.y = y;
    }

    setXCoordinate(x) {
      this.x = x;
    }

    setYCoordinate(y) {
      this.y = y;
    }
  };

  class Point {
    constructor(x, y) {
      this.position = new Coordinate(x, y);
    }

    move(value, direction) {
      switch (direction) {
        case CARDINAL_DIRECTIONS.N:
          this.position.setYCoordinate(this.position.y + value);
          break;
        case CARDINAL_DIRECTIONS.E:
          this.position.setXCoordinate(this.position.x + value);
          break;
        case CARDINAL_DIRECTIONS.S:
          this.position.setYCoordinate(this.position.y - value);
          break;
        case CARDINAL_DIRECTIONS.W:
          this.position.setXCoordinate(this.position.x - value);
          break;
        default:
          break;
      }
    }
  };

  class Ship extends Point {
    constructor(x, y, facing, waypointX, waypointY) {
      super(x, y);

      this.facing = facing || CARDINAL_DIRECTIONS.E;
      
      if (waypointX && waypointY) {
        this.waypoint = new Waypoint(waypointX, waypointY);
      }
    }

    setFacing(facing) {
      this.facing = facing;
    }

    setWaypoint(waypointX, waypointY) {
      this.waypoint = new Waypoint(waypointX, waypointY);
    }

    rotate(value, direction) {
      if (this.waypoint) {
        this.waypoint.rotate(value, direction);
      }

      let facingValue = DEGREES_BY_DIRECTION[this.facing];

      // rotate left or right keeping degree value from 0-360
      facingValue = ((direction === ROTATION_DIRECTIONS.L ? (facingValue - value) : (facingValue + value)) + 360) % 360;

      this.facing = Object.keys(DEGREES_BY_DIRECTION).find(dir => DEGREES_BY_DIRECTION[dir] === facingValue);
    }

    move(value, direction) {
      if (this.waypoint) {
        if (CARDINAL_DIRECTIONS[direction]) {
          this.waypoint.move(value, direction);
          return;
        }

        if (direction === ACTIONS.F) {
          const {x: waypointX, y: waypointY} = this.waypoint.position;
          super.move(value * Math.abs(waypointX), waypointX > 0 ? CARDINAL_DIRECTIONS.E : CARDINAL_DIRECTIONS.W);
          super.move(value * Math.abs(waypointY), waypointY > 0 ? CARDINAL_DIRECTIONS.N : CARDINAL_DIRECTIONS.S);
          return;
        }
      }

      super.move(value, direction === ACTIONS.F ? this.facing : direction);
    }

    navigate(navActions) {
      navActions.forEach(({command, value}) => {
        switch (command) {
          // Actions N, S, E, W means to move by the given value.
          case ACTIONS.N:
          case ACTIONS.S:
          case ACTIONS.E:
          case ACTIONS.W:
          // Action F means to move forward by the given value in the direction the ship is currently facing.
          case ACTIONS.F:
            this.move(value, command);
            break;
          // Actions L and R means to turn the given number of degrees.
          case ACTIONS.L:
          case ACTIONS.R:
            this.rotate(value, command);
            break;
          default:
            break;
        }
      });
    }
  }

  class Waypoint extends Point {
    constructor(x, y) {
      super(x, y);
    }

    move(value, direction) {
      super.move(value, direction);
    }

    rotate(value, direction) {
      const {x: currX, y: currY} = this.position;
      switch (value % 360) {
        case 90:
          this.position.setXCoordinate(direction === ROTATION_DIRECTIONS.L ? currY * -1 : currY);
          this.position.setYCoordinate(direction === ROTATION_DIRECTIONS.L ? currX : currX * -1);
          break;
        case 180:
          this.position.setXCoordinate(currX * -1);
          this.position.setYCoordinate(currY * -1);
          break;
        case 270:
          this.position.setXCoordinate(direction === ROTATION_DIRECTIONS.L ? currY : currY * -1);
          this.position.setYCoordinate(direction === ROTATION_DIRECTIONS.L ? currX * -1 : currX);
          break;
        default:
          break;
      }
    }
  }

  const getManhattanDistance = (endingPos, startingPos = new Coordinate(0, 0)) =>
    Math.abs(startingPos.x - endingPos.x) + Math.abs(startingPos.y - endingPos.y);


  // PART 1 Solution
  const ship = new Ship(0, 0, CARDINAL_DIRECTIONS.E);
  ship.navigate(navigationActions);
  console.log(getManhattanDistance(ship.position));
  
  // PART 2 Solution
  
  // reset ship and add waypoint
  ship.position.setCoordinates(0, 0);
  ship.setWaypoint(10, 1);
  ship.setFacing(CARDINAL_DIRECTIONS.E);
  
  // rerun commands with waypoint
  ship.navigate(navigationActions);
  
  console.log(getManhattanDistance(ship.position));
});
