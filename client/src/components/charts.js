import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { blue, grey, green } from "@mui/material/colors";

function TodosChart({ data }) {
    const filteredData = useMemo(() => {
        return data.reduce((acc, todo) => {
            const { tags, status } = todo;
            tags.forEach(tag => {
                const existingData = acc.find(entry => entry.tag === tag);

                if (existingData) {
                    existingData[status] = isNaN(existingData[status]) ? 1 : existingData[status] + 1;
                } else {
                    const newEntry = { tag };
                    newEntry[status] = 1;
                    acc.push(newEntry);
                }
            });
            return acc;
        }, []);
    }, [data]);

    return (
        <div>
            {filteredData.length ? (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={filteredData}>
                        <CartesianGrid strokeDasharray="2 2" />
                        <XAxis dataKey="tag" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Initial" stackId="stack" fill={grey[300]} />
                        <Bar dataKey="Progress" stackId="stack" fill={blue[300]} />
                        <Bar dataKey="Completed" stackId="stack" fill={green[300]} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}

export default React.memo(TodosChart);

