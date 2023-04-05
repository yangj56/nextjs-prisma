import { useState } from 'react';
import useSWR from 'swr';
import _ from 'lodash';
import { getAirportAPI } from '../fetch';

enum FlightType {
  ONE_WAY = 'oneway',
  ROUND_TRIP = 'roundtrip',
}

enum RouteTab {
  ROUTE = 'Route',
  PASSENGER = 'Passengers',
  OPTIONS = 'Options',
}

const DEBOUNCE_TIME = 300;

const Form: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<RouteTab>(RouteTab.ROUTE);
  const [flightType, setFlightType] = useState<FlightType>(FlightType.ONE_WAY);

  const [filteredStart, setFilteredStart] = useState<string[]>([]);
  const [filteredEnd, setFilteredEnd] = useState<string[]>([]);

  const [startValue, setStartValue] = useState<string>('');
  const [endValue, setEndValue] = useState<string>('');
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const { data } = useSWR('s3/airport', getAirportAPI);

  const getStartAirportDisplay = () => {
    return filteredStart.map((airport) => {
      return (
        <button
          key={`${airport}`}
          onClick={() => {
            setStartValue(airport);
            setShowStart(false);
          }}
          className={`airport-button`}>
          {airport}
        </button>
      );
    });
  };

  const getEndAirportDisplay = () => {
    return filteredEnd.map((airport) => {
      return (
        <button
          key={`${airport}`}
          onClick={() => {
            setEndValue(airport);
            setShowEnd(false);
          }}
          className={`airport-button`}>
          {airport}
        </button>
      );
    });
  };

  const filteredStartDisplay = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const fileredList: string[] = [];
    data?.forEach((country) => {
      const airports = country.airports.filter((airport) =>
        airport.toLowerCase().includes(input.toLocaleLowerCase())
      );
      fileredList.push.apply(fileredList, airports);
    });
    setFilteredStart(fileredList);
  };

  const filteredEndDisplay = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const fileredList: string[] = [];
    data?.forEach((country) => {
      const airports = country.airports.filter((airport) =>
        airport.toLowerCase().includes(input.toLocaleLowerCase())
      );
      fileredList.push.apply(fileredList, airports);
    });
    setFilteredEnd(fileredList);
  };

  const debouncedStartHandler = _.debounce(filteredStartDisplay, DEBOUNCE_TIME);

  const debouncedEndHandler = _.debounce(filteredEndDisplay, DEBOUNCE_TIME);

  return (
    <>
      <div>
        <button onClick={() => setSelectedTab(RouteTab.ROUTE)}>
          {RouteTab.ROUTE}
        </button>
        <button onClick={() => setSelectedTab(RouteTab.PASSENGER)}>
          {RouteTab.PASSENGER}
        </button>
        <button onClick={() => setSelectedTab(RouteTab.OPTIONS)}>
          {RouteTab.OPTIONS}
        </button>
      </div>
      <div>
        {selectedTab === RouteTab.ROUTE && (
          <div className="route-container">
            <div className="form-container">
              <h3>Route</h3>
              <label>
                <input
                  type="radio"
                  name="One-way"
                  value={FlightType.ONE_WAY}
                  checked={flightType === FlightType.ONE_WAY}
                  onChange={() => setFlightType(FlightType.ONE_WAY)}
                />
                One-way
              </label>
              <label>
                <input
                  type="radio"
                  name="Round Trip"
                  value={FlightType.ROUND_TRIP}
                  checked={flightType === FlightType.ROUND_TRIP}
                  onChange={() => setFlightType(FlightType.ROUND_TRIP)}
                />
                Round Trip
              </label>
              <h4>Route</h4>
              <div className="airport-container">
                <div>
                  <input
                    className="airport-input"
                    value={startValue}
                    type="text"
                    onInput={(e) => setStartValue(e.currentTarget.value)}
                    onChange={debouncedStartHandler}
                    onFocus={() => setShowStart(true)}
                    onBlur={(e) => {
                      const targetClassName = e.relatedTarget?.className;
                      if (targetClassName !== 'airport-button') {
                        setShowStart(false);
                      }
                    }}
                  />
                  {showStart && (
                    <div className="filter-list">
                      {getStartAirportDisplay()}
                    </div>
                  )}
                </div>
                <div>
                  <input
                    className="airport-input"
                    value={endValue}
                    type="text"
                    onInput={(e) => setEndValue(e.currentTarget.value)}
                    onChange={debouncedEndHandler}
                    onFocus={() => setShowEnd(true)}
                    onBlur={(e) => {
                      const targetClassName = e.relatedTarget?.className;
                      if (targetClassName !== 'airport-button') {
                        setShowEnd(false);
                      }
                    }}
                  />
                  {showEnd && (
                    <div className="filter-list">{getEndAirportDisplay()}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="costing-container">Costing</div>
            <div className="submit-container">
              <button>Submit</button>
            </div>
          </div>
        )}
        {selectedTab === RouteTab.PASSENGER && (
          <div>
            <span>
              <h3>Passengers</h3>
            </span>
          </div>
        )}
        {selectedTab === RouteTab.OPTIONS && (
          <div>
            <span>
              <h3>Options</h3>
            </span>
          </div>
        )}
      </div>
      <style jsx>{`
        .route-container {
          display: grid;
          grid-template-areas:
            'form cost'
            'submit cost';
          grid-template-rows: 1fr 1fr;
        }
        .form-container {
          grid-area: form;
        }
        .submit-container {
          grid-area: submit;
        }
        .costing-container {
          grid-area: cost;
          background-color: lightgrey;
          height: 200px;
          width: 200px;
        }
        .airport-input {
          width: 200px;
        }
        .airport-container {
          display: flex;
          flex-direction: row;
        }
        .filter-list {
          width: 200px;
          display: flex;
          flex-direction: column;
        }
        @media only screen and (max-width: 600px) {
          .route-container {
            display: grid;
            grid-template-areas:
              'form form'
              'cost submit';
            grid-template-rows: 1fr 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default Form;
