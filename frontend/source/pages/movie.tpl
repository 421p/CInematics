<div class="container">
  <div class="row">
    <h2 class="text-center bgTitle">{Title}</h2></div>
</div>

<div class="container">
  <div class="row">
    <div class="col-lg-12 bg">
      <div class="row">
        <div class="col-lg-4 poster">
          <img src="movies/{MovieID}/poster.jpg" alt="{Title}" class="img-responsive center-block">
          <div class="row">
            <div class="col-lg-12 text-center">
              <button type="button" class="btn btn-danger" movie-id="{MovieID}">Купить Билет</button>
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="col-lg-10">
            <div class="row pad-top">
              <table>
                <tbody>
                  <tr class="board_seance">
                    <td class="bi_title">сеансы:</td>
                    <td>C {SessionStarts}</td>
                  </tr>
                  <tr>
                    <td class="bi_title">год:</td>
                    <td>{Year}</td>
                  </tr>
                  <tr>
                    <td class="bi_title">страна:</td>
                    <td>{Country}</td>
                  </tr>
                  <tr>
                    <td class="bi_title">жанр:</td>
                    <td>{Genre}</td>
                  </tr>
                  <tr>
                    <td class="bi_title">бюджет:</td>
                    <td>{Budget}</td>
                  </tr>
                  <tr>
                    <td class="bi_title">время:</td>
                    <td>{Time}</td>
                  </tr>
                  <tr>
                    <td class="bi_title">перевод:</td>
                    <td>{Translation}</td>
                  </tr>
                  <tr>
                    <td class="bi_title">В ролях:</td>
                    <td>{Actors}</td>
                  </tr>
                  <tr>
                    <td colspan=2 class="bi_about">{About}</td>
                  </tr>
                  <tr>
                    <td colspan=2 class="bi_trailer text-center">
                      <iframe class="trailer" width="380" height="180" src="https://www.youtube.com/embed/{Video}?autohide=1&showinfo=0" frameborder="0" allowfullscreen></iframe>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>


          </div>
          <div class="col-lg-2 text-center">
            <div class="row images">
              <a href="movies/{MovieID}/1.jpg" class="fancybox" title="{Title}" rel="gallery">
                  <img src="movies/{MovieID}/1.jpg" alt="{Title}" class="fancy-image">
              </a>
              <a href="movies/{MovieID}/2.jpg" class="fancybox" title="{Title}" rel="gallery">
                  <img src="movies/{MovieID}/2.jpg" alt="{Title}" class="fancy-image">
              </a>
              <a href="movies/{MovieID}/3.jpg" class="fancybox" title="{Title}" rel="gallery">
                  <img src="movies/{MovieID}/3.jpg" alt="{Title}" class="fancy-image">
              </a>
              <a href="movies/{MovieID}/4.jpg" class="fancybox" title="{Title}" rel="gallery">
                  <img src="movies/{MovieID}/4.jpg" alt="{Title}" class="fancy-image">
              </a>
              <a href="movies/{MovieID}/5.jpg" class="fancybox" title="{Title}" rel="gallery">
                  <img src="movies/{MovieID}/5.jpg" alt="{Title}" class="fancy-image">
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>