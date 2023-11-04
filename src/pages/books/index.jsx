import { useLocation } from "react-router-dom";
import BookTable from "../../components/Admin/Book/BookTable";
import ViewDetail from "../../components/Home/ViewDetail";
import { useEffect, useState } from "react";
import { callFetchBookById } from "../../services/api";

const BookPage = () => {
    const [dataBook, setDataBook] = useState();
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); //lay id tu trang web truoc

    useEffect(() => {
        fetchBook(id);
    },[id])

    const fetchBook = async (id) => {
        const res = await callFetchBookById(id);
        if(res && res.data){
            let raw = res.data;
            //process data
            raw.items= getImages(raw);

            setTimeout(() => {
                setDataBook(raw);
            },2000)
        }
    }

    const getImages = (raw) => {
        const images = [];
        if(raw.thumbnail){
            images.push({
                original:`${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
                thumbnail:`${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
            })
        }
        if(raw.slider){
            raw.slider?.map(item => {
                images.push({
                    original:`${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    thumbnail:`${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                })
            })
        }
        return images;
    }

    return(
        <div>
            <ViewDetail dataBook={dataBook}/>
        </div>
    )
}

export default BookPage;