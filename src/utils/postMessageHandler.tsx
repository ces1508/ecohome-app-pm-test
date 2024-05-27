import {Alert, Linking, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import DocumentPicker from 'react-native-document-picker';
import {converToBase64} from './convertToBase64';

export interface IPostMessagePayload {
  fn: string;
  message: {
    receiver?: string;
    callNumber?: string | number;
    url?: string;
    fnCallBack?: string;
  };
  webViewInstance?: any;
}

const POST_MESSAGE_KEYS = {
  appSendMail: openEmail,
  appAdvisorCall: openPhone,
  appLoadImages: openFileStorage,
  appLocalization: sendCurrentLocation,
  // appDownloadFile: donwloadFile,
};

function isIos() {
  return Platform.OS === 'ios';
}

export function openPhone({callNumber}: {callNumber: string}) {
  const prefix = isIos() ? 'telprompt:' : 'tel:';
  Linking.openURL(`${prefix}${encodeURIComponent(callNumber)}`);
}

export function openEmail({receiver}: {receiver: string}) {
  Linking.openURL(`mailto:${receiver}`);
}

export function openWebsite({url}: {url: string}) {
  Linking.openURL(url);
}

export function openFileStorage({
  fnCallBack,
  webViewInstance,
}: {
  fnCallBack: string;
  webViewInstance: any;
}) {
  DocumentPicker.pick({
    allowMultiSelection: true,
    type: [DocumentPicker.types.images],
  })
    .then(files => {
      const filesBase64 = files.map(file =>
        converToBase64({uri: file.uri, mimeType: file.type as string}),
      );
      return Promise.all(filesBase64);
    })
    .then(filesBase64 => {
      webViewInstance.current.postMessage(
        JSON.stringify({
          fn: fnCallBack,
          images: filesBase64,
        }),
      );
    });
}

export function sendCurrentLocation({
  fnCallBack,
  webViewInstance,
}: {
  fnCallBack: string;
  webViewInstance: any;
}) {
  webViewInstance.current.postMessage(
    JSON.stringify({
      fn: fnCallBack,
      key: fnCallBack,
      msg: {
        latitude: 1,
        longitude: 0,
      },
    }),
    console.log('emitimis el evento'),
  );

  // message?.fnCallback({message: {latitude: 1, longitude: 0}});
  // Geolocation.setRNConfiguration({
  //   skipPermissionRequests: false,
  // });
  // Geolocation.requestAuthorization(() => {
  //   Geolocation.getCurrentPosition(
  //     postition => {
  //       fnCallback({
  //         message: {
  //           latitude: postition.coords.latitude,
  //           longitude: postition.coords.longitude,
  //         },
  //       });
  //     },
  //     () => Alert.alert('Error', 'Error getting location'),
  //     {
  //       enableHighAccuracy: true,
  //     },
  //   );
  // });
}

export function handlerPM({
  postMessage,
  webViewInstance,
}: {
  postMessage: IPostMessagePayload;
  webViewInstance: any;
}): void {
  console.log(postMessage);
  const {fn: key, message} = postMessage;
  if (POST_MESSAGE_KEYS[key as keyof typeof POST_MESSAGE_KEYS]) {
    POST_MESSAGE_KEYS[key as keyof typeof POST_MESSAGE_KEYS]({
      ...message,
      webViewInstance,
    } as any);
  } else {
    console.log('Function not found');
  }
}
