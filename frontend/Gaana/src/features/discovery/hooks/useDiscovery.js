import { useEffect, useState } from "react";
import { getDiscoveryData } from "../service/discovery.api";

const useDiscovery = () => {
    const [discoveryData, setDiscoveryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDiscoveryData = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getDiscoveryData();

            setDiscoveryData(data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load discovery data"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscoveryData();
    }, []);

    return {
        discoveryData,
        loading,
        error,
        fetchDiscoveryData
    };
};

export default useDiscovery;