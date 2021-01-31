import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {API, WOWZA_CLOUD_ACCESS_KEY, WOWZA_CLOUD_API_KEY, WOWZA_CLOUD_HOST} from '../helpers/global-constants';
import {concatMap} from 'rxjs/operators';


// Wowza headers
const headers: HttpHeaders = new HttpHeaders({
  'Content-Type': 'application/json',
  'wsc-api-key': WOWZA_CLOUD_API_KEY,
  'wsc-access-key': WOWZA_CLOUD_ACCESS_KEY
});

@Injectable({
  providedIn: 'root'
})
export class WowzaService {

  constructor(private http: HttpClient) {
  }

  getLiveStreams() {
    return this.http.get(`${WOWZA_CLOUD_HOST}/live_streams`, {headers: headers});
  }

  createLiveStream(name: string, file_src: string) {
    return this.http.post(`${WOWZA_CLOUD_HOST}/live_streams`, {
      'live_stream': {
        'aspect_ratio_height': 1080,
        'aspect_ratio_width': 1920,
        'billing_mode': 'pay_as_you_go',
        'broadcast_location': 'eu_germany',
        'encoder': 'file',
        'name': name,
        'transcoder_type': 'transcoded',
        'closed_caption_type': 'none',
        'delivery_type': 'single-bitrate',
        'disable_authentication': false,
        // "hosted_page": true,
        // "hosted_page_description": "My Hosted Page Description",
        // "hosted_page_logo_image": "[Base64-encoded string representation of GIF, JPEG, or PNG file]",
        // "hosted_page_sharing_icons": true,
        // "hosted_page_title": "My Hosted Page",
        // "low_latency": false,
        // "player_countdown": false,
        // "player_logo_image": "[Base64-encoded string representation of GIF, JPEG, or PNG file]",
        // "player_logo_position": "top-right",
        // "player_responsive": false,
        // "player_type": "wowza_player",
        // "player_video_poster_image": "[Base64-encoded string representation of GIF, JPEG, or PNG file]",
        'player_width': 640,
        'recording': false,
        'remove_hosted_page_logo_image': true,
        'remove_player_logo_image': true,
        'remove_player_video_poster_image': true,
        'source_url': file_src,
        'target_delivery_protocol': 'hls-https',
        'use_stream_source': false,
        'vod_stream': true
      }
    }, {headers: headers});
  }

  startStream(id: string) {
    return this.http.put(`${WOWZA_CLOUD_HOST}/live_streams/${id}/start`, {}, {headers: headers});
  }


}
