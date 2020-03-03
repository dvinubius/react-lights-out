import React from 'react';
import './Gallery.css'

export interface GalleryProps {
  numberOfBoxesPerSide: number;
  durationInSec: number;
  margin: number;
  renderBoxes: (boxSize: number) => any[]
}

export interface GalleryState {
  colors: string[];
  boxSize: number;
}

class Gallery extends React.Component<GalleryProps> {
  constructor(props: GalleryProps) {
    super(props);
    document.documentElement.style.setProperty('--duration', props.durationInSec+'');
  }

  private _computePaddingInPage() {
    return 2 * this.props.margin;
  }

  private _computeBoxSize(): number { 
     return Math.floor(
       (Math.min(window.innerWidth, window.innerHeight) -
       this._computePaddingInPage())/this.props.numberOfBoxesPerSide
      );
  }

  boxSize = this._computeBoxSize();
  boxes = () => this.props.renderBoxes(this.boxSize);

  render() {
    const style = {
      "--size": this._computeBoxSize()*this.props.numberOfBoxesPerSide + 'px',
    } as React.CSSProperties; 
    return (
      <div className="GalleryLayout" style={style}>{this.boxes()}</div>
    )
  }
}

export default Gallery;