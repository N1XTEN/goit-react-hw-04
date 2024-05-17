import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import SearchBar from './components/SearchBar/SearchBar';
import ImageGallery from './components/ImageGallery/ImageGallery';
import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import LoadMoreBtn from './components/LoadMoreBtn/LoadMoreBtn';
import ImageModal from './components/ImageModal/ImageModal';

const App = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMoreImages, setHasMoreImages] = useState(true);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const apiKey = 'u1pYBtTMwptTTgHzMmIFHs3Gsp7PkMcfyNKZkU_OJJk';

  useEffect(() => {
    if (!query) return;

    const fetchImages = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('https://api.unsplash.com/search/photos/', {
          params: { client_id: apiKey, query, orientation: 'landscape', page, per_page: 12 },
          headers: { Authorization: `Client-ID ${apiKey}` },
        });
        const newImages = data.results.map(({ alt_description, id, urls }) => ({
          alt: alt_description,
          id,
          small: urls.small,
          regular: urls.regular,
        }));

        setImages(prev => (page === 1 ? newImages : [...prev, ...newImages]));
        setHasMoreImages(newImages.length === 12);
        setError('');
      } catch {
        setError('Error fetching images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [query, page, apiKey]);

  const handleSearch = query => {
    setQuery(query);
    setPage(1);
    setImages([]);
  };

  const loadMore = () => setPage(prev => prev + 1);

  const handleImageClick = image => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {images.length > 0 && (
        <>
          <ImageGallery images={images} onClick={handleImageClick} />
          {hasMoreImages && <LoadMoreBtn onClick={loadMore} />}
        </>
      )}
      {selectedImage && (
        <ImageModal images={selectedImage} isOpen={isModalOpen} onRequestClose={closeModal} />
      )}
    </>
  );
};

export default App;
