import { Component } from '@angular/core';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-tutoriales',
  standalone: true,
  imports: [],
  templateUrl: './tutoriales.component.html',
  styleUrl: './tutoriales.component.css'
})
export class TutorialesComponent {
  constructor(private sanitizer: DomSanitizer) {}
  getSafeUrl(videoId: string) {
    const url = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
