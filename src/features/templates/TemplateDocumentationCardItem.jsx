import Badge from '../../components/Badge';

export default function TemplateDocumentationCardItem({ itemMetadata, path }) {

    function renderRequired(isRequired){
        return (
            isRequired ? <span className='text-xs text-gray-400'>Required</span> : null
        );
    }

    const itemPathElements = path.split(".");
    const itemTypeIsCategorical = !["object", "boolean", "array"].includes(itemMetadata.type);


    return (
        <div className='border-1 border-gray-50 bg-white p-4 rounded-md'>
            <div className="flex items-center justify-between">
                <div className='flex justify-between gap-2 flex-wrap'>
                    <h3 className="text-md text-gray-900">{itemPathElements.length > 1 ? itemPathElements[itemPathElements.length - 1] : path}</h3>
                    <div>
                        {
                            itemMetadata.type !== null && itemMetadata.type !== undefined &&  itemMetadata.type !== "" ? 
                            <Badge variant={itemMetadata.type === "unknown" ? "warning" : "gray"} label={itemMetadata.type} /> 
                            : <Badge variant={"warning"} label={"unknown"} />
                        }
                    </div>
                    <div>
                        {itemMetadata.optional ? renderRequired(!itemMetadata.optional) : renderRequired(true)}
                    </div>
                </div>

            </div>
            <p className="text-sm my-2 text-gray-700">
                {
                    itemMetadata.description && itemMetadata.description !== "" ? itemMetadata.description : "No description yet." 
                }
            </p>
            {
                itemTypeIsCategorical && itemMetadata.options && itemMetadata.options.length > 0 &&
                <div className="flex items-center gap-2 flex-wrap mt-1">
                    <h4 className='text-sm mr-2 text-gray-600'>Accepted values:</h4>
                    <>
                        {
                            itemMetadata.options.map((option) => {
                                return (
                                    <span key={`${option}`} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded mr-1">
                                        {option}
                                    </span>
                                    );
                            }) 
                        }
                    </>
                </div>
            }
        </div>
    );
}
