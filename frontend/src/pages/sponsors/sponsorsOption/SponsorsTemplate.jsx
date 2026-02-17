function SponsorsTemplate({name, img, url}) {
    

    return (
       <section id="sponsors-template">
        <div>
            <h2>Sponsor:{name}</h2>
        </div>
        <div className="bg-white border border-white/10 rounded-lg p-4">
        <a href={url}>
            <img
            src={img}
            alt={name}
            />
        </a>
        </div>
       </section>
    )
}

export default SponsorsTemplate;