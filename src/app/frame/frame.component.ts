import { Component, Input, OnInit } from '@angular/core';
import { Frame } from '../frame.model';

@Component({
  selector: 'bowling-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss']
})
export class FrameComponent implements OnInit {
  @Input() frame?: Frame;
  @Input() frameIndex?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
