import React from "react";
import ImageIcon from "../../images/MediaIcons/ImageIcon.png";
import PdfIcon from "../../images/MediaIcons/PdfIcon.png";
import SheetIcon from "../../images/MediaIcons/ExcelIcon.png";
import VideoIcon from "../../images/MediaIcons/VideoIcon.png";
import MusicIcon from "../../images/MediaIcons/MusicIcon.png";
import PowerPointIcon from "../../images/MediaIcons/PowerPointIcon.png";
import TextIcon from "../../images/MediaIcons/TextIcon.png";
import WordIcon from "../../images/MediaIcons/WordIcon.png";

const ShowIcons = ({ fileName }) => {
  if (
    fileName.includes("jpg") ||
    fileName.includes(".png") ||
    fileName.includes(".gif") ||
    fileName.includes(".svg")
  ) {
    return <img src={ImageIcon} alt="thumbnail" height={40} />;
  }
  if (
    fileName.includes(".mp4") ||
    fileName.includes(".mov") ||
    fileName.includes(".wmv") ||
    fileName.includes(".avi") ||
    fileName.includes(".mkv")
  ) {
    return <img src={VideoIcon} alt="thumbnail" height={40} />;
  }
  if (
    fileName.includes(".xlsx") ||
    fileName.includes(".xlsm") ||
    fileName.includes(".xls") ||
    fileName.includes(".csv")
  ) {
    return <img src={SheetIcon} alt="thumbnail" height={40} />;
  }
  if (fileName.includes(".pdf")) {
    return <img src={PdfIcon} alt="thumbnail" height={40} />;
  }
  if (fileName.includes(".txt") || fileName.includes(".rtf")) {
    return <img src={TextIcon} alt="thumbnail" height={40} />;
  }
  if (
    fileName.includes(".doc") ||
    fileName.includes(".docx") ||
    fileName.includes(".wpd")
  ) {
    return <img src={WordIcon} alt="thumbnail" height={40} />;
  }
  if (
    fileName.includes(".pptx") ||
    fileName.includes(".pptm") ||
    fileName.includes(".ppt")
  ) {
    return <img src={PowerPointIcon} alt="thumbnail" height={40} />;
  }
  if (
    fileName.includes(".mp3") ||
    fileName.includes(".aac") ||
    fileName.includes(".ogg") ||
    fileName.includes(".wav") ||
    fileName.includes(".wma") ||
    fileName.includes(".flac")
  ) {
    return <img src={MusicIcon} alt="thumbnail" height={40} />;
  } else {
    return null;
  }
};

export default ShowIcons;
