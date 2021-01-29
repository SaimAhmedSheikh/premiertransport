import { Linking, Platform } from 'react-native';


export default (origin = null, destination, transportType) => new Promise((resolve, reject) => {
	const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving&dir_action=navigate`;
    console.log('Opening url: ', url);
    _openApp(url).then(result => { resolve(result) });
});

const _openApp = (url) => new Promise((resolve, reject) => {
	Linking.canOpenURL(url)
		.then(res => {
			Linking.openURL(url)
				.then(result => {
					resolve('opening app....');
				}).catch(err => { reject('Cannot link app!!!'); })
		}).catch(err => {
			reject('Cannot open app!!!');
		})
});

const _checkParameters = (param) => {
	if (param === null || param === undefined || typeof param.latitude === 'string' || typeof param.longitude === 'string') { return null; }

	if (isValidCoordinates.longitude(param.longitude) && isValidCoordinates.latitude(param.latitude)) {
		return `${param.latitude},${param.longitude}`
	}

	return null;
}

const _checkTransportParameter = (param) => {
	const _transportType = param.toLowerCase();
	if (_transportType === 'd' || _transportType === 'w' || _transportType === 'r') {
		return _transportType;
	}

	return 'w';
}
