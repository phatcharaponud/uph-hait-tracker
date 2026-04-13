export const HAIT_DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/1-wPeCwqDH7_BYpq2qHiVUxZRNaqWRNcA';

export const HOSPITAL_NAME = 'โรงพยาบาลมหาวิทยาลัยพะเยา';

export const CATEGORY_DRIVE_URLS: Record<number, string> = {
  1: 'https://drive.google.com/drive/folders/13TYFRYu4TzINaTb0xBw4vO5d_jgrbanC',
  2: 'https://drive.google.com/drive/folders/1UiAUMmCP2Duz5vKcK1a-ITMwxR1m5YPG',
  3: 'https://drive.google.com/drive/folders/1ti012iR7OGI_drTi31yiGTKdp_Mp3isG',
  4: 'https://drive.google.com/drive/folders/1jTlyCpJ3ddhxEaPH2btUiXIdHQMlNWG5',
  5: 'https://drive.google.com/drive/folders/1NLm6T5YbkuSU8f488sx7urznp3oIBXa9',
  6: 'https://drive.google.com/drive/folders/1jAaQbAbr0DSkU-fT_ZV873C89_0ShJUJ',
  7: 'https://drive.google.com/drive/folders/1LlOWOlGahOz9mwE6v3abOMJ52rdh7IJv',
};

export const getCategoryDriveUrl = (catId: number): string =>
  CATEGORY_DRIVE_URLS[catId] || HAIT_DRIVE_FOLDER_URL;
