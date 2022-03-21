package be.vinci.pae.biz.offer.interfaces;

import be.vinci.pae.biz.item.interfaces.ItemDTO;
import be.vinci.pae.biz.offer.objects.OfferImpl;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import java.sql.Date;

@JsonDeserialize(as = OfferImpl.class)
public interface OfferDTO {

  int getId();

  void setId(int id);

  Date getDate();

  void setDate(Date date);

  String getTimeSlot();

  void setTimeSlot(String timeSlot);

  ItemDTO getItem();

  void setItem(ItemDTO itemDTO);
}
