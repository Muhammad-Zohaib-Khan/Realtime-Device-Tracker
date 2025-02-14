import L from 'leaflet';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef } from 'react';

const socket = io.connect('http://localhost:5000');

export const Show = () => {
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState({});
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data on component mount
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/read');
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status}`);
        }
        const result = await response.json();
        setUsers(result.data); 
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();

    // Initialize the map only once
    if (!mapRef.current) {
      const newMap = L.map('map').setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'My Country Map',
      }).addTo(newMap);
      mapRef.current = newMap;
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          socket.emit('Send-location', { latitude, longitude });
        },
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }

    socket.on('receive-location', (data) => {
      const { id, latitude, longitude } = data;

      setMarkers((prevMarkers) => {
        const updatedMarkers = { ...prevMarkers };

        if (updatedMarkers[id]) {
          updatedMarkers[id].setLatLng([latitude, longitude]);
        } else {
          const newMarker = L.marker([latitude, longitude])
            .addTo(mapRef.current)
            .bindPopup('<div>Loading...</div>');

          newMarker.on('click', () => {
            const userOptions = users
              .map(
                (user) =>
                  `<option value="${user.email}">${user.name}</option>`
              )
              .join('');

            newMarker.setPopupContent(`
              <div>
                <select id="user-select-${id}">
                  <option value="">Select a user</option>
                  ${userOptions}
                </select>
              </div>
            `);

            setTimeout(() => {
              const selectElement = document.getElementById(
                `user-select-${id}`
              );
              if (selectElement) {
                selectElement.addEventListener('change', (event) => {
                  const selectedUser = users.find(
                    (user) => user.email === event.target.value
                  );
                  if (selectedUser) {
                    newMarker.setPopupContent(`
                      <div>
                        <img src="${selectedUser.image}" alt="${selectedUser.name}" width="50" />
                        <p><strong>${selectedUser.name}</strong></p>
                      </div>
                    `);
                  }
                });
              }
            }, 100); // Delay to ensure the DOM is updated
          });

          updatedMarkers[id] = newMarker;
        }

        return updatedMarkers;
      });
    });

    return () => {
      socket.off('receive-location');
    };
  }, [users]);

  return (
    <>
      <div id="map" style={{ height: '100vh' }}></div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </>
  );
};

export default Show;