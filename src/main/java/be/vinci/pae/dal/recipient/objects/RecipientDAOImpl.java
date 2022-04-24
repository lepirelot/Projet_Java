package be.vinci.pae.dal.recipient.objects;

import be.vinci.pae.biz.recipient.interfaces.RecipientDTO;
import be.vinci.pae.dal.recipient.interfaces.RecipientDAO;
import be.vinci.pae.dal.services.interfaces.DALBackendService;
import jakarta.inject.Inject;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.apache.commons.text.StringEscapeUtils;

public class RecipientDAOImpl implements RecipientDAO {

  private static final String ASSIGNED_ITEM_STATUS = "assigned";
  private static final String RECEIVED_DEFAULT = "waiting";
  //private static final String NOT_RECEIVED = "not received";
  //private static final String RECEIVED = "received";
  @Inject
  private DALBackendService dalBackendService;

  @Override
  public boolean chooseRecipient(RecipientDTO recipientDTO) throws SQLException {
    String selectMemberId = "SELECT m.id_member "
        + "FROM project_pae.members m "
        + "WHERE m.username = ?";
    String query = "INSERT INTO project_pae.recipients (id_item, id_member, received) "
        + "VALUES (?, (" + selectMemberId + "), '" + RECEIVED_DEFAULT + "'); "
        + "UPDATE project_pae.items "
        + "SET offer_status = '" + ASSIGNED_ITEM_STATUS + "' "
        + "WHERE id_item = ?;";
    try (PreparedStatement ps = this.dalBackendService.getPreparedStatement(query)) {
      ps.setInt(1, recipientDTO.getItem().getId());
      ps.setString(2, StringEscapeUtils.escapeHtml4(
          recipientDTO.getMember().getUsername()
      ));
      ps.setInt(3, recipientDTO.getItem().getId());
      return ps.executeUpdate() != 0;
    }
  }

  @Override
  public boolean exists(RecipientDTO recipientDTO) throws SQLException {
    String selectIdMemberRecipient = "SELECT id_member "
        + "FROM project_pae.members "
        + "WHERE username = ?";
    String query = "SELECT id_recipient "
        + "FROM project_pae.recipients "
        + "WHERE id_member = (" + selectIdMemberRecipient + ") "
        + "  AND id_item = ? "
        + "LIMIT 1;";
    try (PreparedStatement ps = this.dalBackendService.getPreparedStatement(query)) {
      ps.setString(1, StringEscapeUtils.escapeHtml4(
          recipientDTO.getMember().getUsername()
      ));
      ps.setInt(2, recipientDTO.getItem().getId());
      System.out.println(recipientDTO);
      try (ResultSet rs = ps.executeQuery()) {
        return rs.next();
      }
    }
  }
}