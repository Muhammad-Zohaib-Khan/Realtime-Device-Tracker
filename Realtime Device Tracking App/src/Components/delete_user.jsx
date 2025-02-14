import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Delete = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const deleteItem = async () => {
            try {
                const response = await fetch(`http://localhost:5000/delete/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json(); 

                if (data.redirect) {
                    navigate(data.redirect);
                }
            } catch (error) {
                console.error("Error deleting item:", error);
            }
        };

        deleteItem();
    }, [id, navigate]);

    
};

export default Delete;
